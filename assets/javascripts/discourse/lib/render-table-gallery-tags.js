import renderTableGalleryTag from "./render-table-gallery-tag";

let callbacks = null;
let priorities = null;

export function addTagsHtmlCallback(callback, options) {
  callbacks = callbacks || [];
  priorities = priorities || [];
  const priority = (options && options.priority) || 0;

  let i = 0;
  while (i < priorities.length && priorities[i] > priority) {
    i += 1;
  }

  priorities.splice(i, 0, priority);
  callbacks.splice(i, 0, callback);
}

export function clearTagsHtmlCallbacks() {
  callbacks = null;
  priorities = null;
}

export default function (topic, params) {
  let tags = topic.tags;
  let buffer = "";
  let tagsForUser = null;
  let tagName;
  const isPrivateMessage = topic.get("isPrivateMessage");

  let category = topic.category;
  let categoryPath = topic.category.get('path');
  let siteSettings = params.siteSettings;
  let hiddenTags = siteSettings.table_gallery_hidden_tags.split("|");

  if (params) {
    if (params.mode === "list") {
      tags = topic.get("visibleListTags");
    }
    if (params.tagsForUser) {
      tagsForUser = params.tagsForUser;
    }
    if (params.tagName) {
      tagName = params.tagName;
    }
  }

  tags = tags.sort( function (a, b) {
    if (hiddenTags.includes(a)) {
      return 1;
    } else {
      return -1;
    }
  });

  let tagsToRender = tags.slice(0,3);

  if (tagsToRender && tagsToRender.length > 0) {
    buffer = "<div class='discourse-tags'>";

    if (tagsToRender) {
      for (let i = 0; i < tagsToRender.length; i++) {
        buffer +=
          renderTableGalleryTag(tagsToRender[i], {
            description:
              topic.tags_descriptions && topic.tags_descriptions[tagsToRender[i]],
            isPrivateMessage,
            tagsForUser,
            tagName,
            categoryPath
          }) + " ";
      }
    }

    if (tags.length > 3) {
      const numExcessTags = tags.length - 3;
      buffer += "<span class='discourse-tag excess-tags'>(+" + numExcessTags + ")</span>";
    }

    buffer += "</div>";
  }

  return buffer;
}
