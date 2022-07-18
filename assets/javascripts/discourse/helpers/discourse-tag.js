import { htmlSafe } from "@ember/template";
import { registerUnbound, helperContext } from "discourse-common/lib/helpers";
import renderTag from "discourse/lib/render-tag";
import renderTableGalleryTag from "../lib/render-table-gallery-tag";
import { galleryCategoryIds } from "../lib/table-gallery";

export default registerUnbound("discourse-tag", function (name, params) {
  let tag;
  let siteSettings = helperContext().siteSettings;

  if (galleryCategoryIds(siteSettings).includes(topic.get("category_id"))) {
    params.siteSettings = siteSettings;
    tag = renderTableGalleryTag(topic, params);
  } else {
    tag = renderTag(topic, params);
  }

  return htmlSafe(tag);
});
