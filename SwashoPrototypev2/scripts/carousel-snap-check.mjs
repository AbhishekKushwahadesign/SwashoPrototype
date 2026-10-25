/**
 * Verifies service carousel center snap at ~400px viewport (6-service fixture via q=snap-test).
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const VIEWPORT_W = Number(process.env.VIEWPORT_W ?? 410);

function findServiceScroll(page) {
  return page.evaluate(() => {
    const scrolls = [...document.querySelectorAll('div')].filter(
      (el) =>
        el.scrollWidth > el.clientWidth + 40 &&
        el.clientHeight > 0 &&
        el.clientHeight < 80 &&
        getComputedStyle(el).overflowX === 'auto',
    );
    return scrolls[0] ? true : false;
  });
}

async function measureSnap(page) {
  return page.evaluate(() => {
    const scroll = [...document.querySelectorAll('div')].find(
      (el) =>
        el.scrollWidth > el.clientWidth + 40 &&
        el.clientHeight > 0 &&
        el.clientHeight < 80 &&
        getComputedStyle(el).overflowX === 'auto',
    );
    if (!scroll) {
      return { error: 'scroll not found' };
    }

    const viewportCenter = scroll.getBoundingClientRect().left + scroll.clientWidth / 2;
    const row = scroll.firstElementChild;
    const slots = row
      ? [...row.children].filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 80 && r.height > 20;
        })
      : [];

    const chipRects = slots.map((el, index) => {
      const r = el.getBoundingClientRect();
      const center = r.left + r.width / 2;
      return {
        index,
        label: (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 36),
        slotWidth: r.width,
        centerDelta: center - viewportCenter,
      };
    });

    const emphasized = chipRects.find((c) => Math.abs(c.centerDelta) < 6);

    return {
      scrollLeft: scroll.scrollLeft,
      viewportWidth: scroll.clientWidth,
      chipCount: chipRects.length,
      chips: chipRects,
      centered: emphasized ?? null,
    };
  });
}

async function tapChipByIndex(page, index) {
  await page.evaluate((idx) => {
    const scroll = [...document.querySelectorAll('div')].find(
      (el) =>
        el.scrollWidth > el.clientWidth + 40 &&
        el.clientHeight > 0 &&
        el.clientHeight < 80 &&
        getComputedStyle(el).overflowX === 'auto',
    );
    if (!scroll?.firstElementChild) return;
    const slots = [...scroll.firstElementChild.children].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 80 && r.height > 20;
    });
    const target = slots[idx];
    if (target) {
      target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }
  }, index);
  await page.waitForTimeout(650);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: VIEWPORT_W, height: 900 } });

  const photoUrl = `${BASE}/checkout/garment-photo-upload?providerId=provider-1&q=snap-test&garmentId=mens-shirt&serviceId=wash-iron`;
  await page.goto(photoUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  if (!(await findServiceScroll(page))) {
    console.error('Service carousel scroll not found');
    await browser.close();
    process.exit(1);
  }

  const results = [];
  for (const idx of [0, 2, 4, 5]) {
    await tapChipByIndex(page, idx);
    const m = await measureSnap(page);
    results.push({ tappedIndex: idx, ...m });
  }

  console.log(JSON.stringify({ viewport: VIEWPORT_W, results }, null, 2));

  const failed = results.filter(
    (r) => r.error || !r.centered || Math.abs(r.centered.centerDelta) > 5,
  );

  await browser.close();
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
