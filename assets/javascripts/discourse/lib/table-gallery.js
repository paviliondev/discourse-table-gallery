const galleryCategoryIds = function(siteSettings) {
  return siteSettings.table_gallery_categories
    .split("|")
    .map((id) => parseInt(id, 10));
}

export {
  galleryCategoryIds
}
