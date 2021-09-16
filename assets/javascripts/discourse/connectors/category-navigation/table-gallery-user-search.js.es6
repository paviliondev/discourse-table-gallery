export default {
  shouldRender(args, component) {
    // is this the right category to be showing this?

    const categorySlug = args.category?.slug;
    const galleryCategories =
      args.category?.siteSettings?.table_gallery_categories?.split("|");
    const isGalleryCategory = galleryCategories.includes(categorySlug);

    return isGalleryCategory;
  },
};
