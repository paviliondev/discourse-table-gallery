import { htmlSafe } from "@ember/template";
import { registerUnbound, helperContext } from "discourse-common/lib/helpers";
import renderTags from "discourse/lib/render-tags";
import renderTableGalleryTags from "../lib/render-table-gallery-tags";
import { galleryCategoryIds } from "../lib/table-gallery";

export default registerUnbound("discourse-tags", function (topic, params) {
  let tagList;
  let siteSettings = helperContext().siteSettings;

  if (galleryCategoryIds(siteSettings).includes(topic.get("category_id"))) {
    params.siteSettings = siteSettings;
    tagList = renderTableGalleryTags(topic, params);
  } else {
    tagList = renderTags(topic, params);
  }

  return htmlSafe(tagList);
});
