/** Prefix SVG id/url(#id) refs so multiple SvgXml instances do not clash on RN Web. */
export function scopeSvgXmlIds(xml: string, scope: string): string {
  const idPattern = /\bid="([^"]+)"/g;
  const ids: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = idPattern.exec(xml)) !== null) {
    ids.push(match[1]);
  }
  ids.sort((a, b) => b.length - a.length);

  let result = xml;
  for (const id of ids) {
    const scoped = `${scope}_${id}`;
    result = result.replaceAll(`id="${id}"`, `id="${scoped}"`);
    result = result.replaceAll(`url(#${id})`, `url(#${scoped})`);
  }
  return result;
}
