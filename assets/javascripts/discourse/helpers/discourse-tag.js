import { htmlSafe } from "@ember/template";
import { registerUnbound, helperContext } from "discourse-common/lib/helpers";
import renderTag from "discourse/lib/render-tag";
import renderTableGalleryTag from "../lib/render-table-gallery-tag";
import { galleryCategoryIds } from "../lib/table-gallery";

export default registerUnbound("discourse-tag", function (name, params) {
  let tag;
  let siteSettings = helperContext().siteSettings;

  if (false) {
    params.siteSettings = siteSettings;
    tag = renderTableGalleryTag(name, params);
  } else {
    tag = renderTag(name, params);
  }

  return htmlSafe(tag);
});
