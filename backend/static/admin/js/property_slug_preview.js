(function () {
  function slugify(value) {
    if (!value) return "";
    return value
      .toString()
      .toLowerCase()
      .trim()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function updatePreview() {
    var titleInput = document.getElementById("id_title");
    var slugReadonlyNode = document.querySelector(".field-slug .readonly");
    if (!titleInput || !slugReadonlyNode) return;

    var existingSlug = (slugReadonlyNode.dataset.existingSlug || slugReadonlyNode.textContent || "").trim();
    if (!slugReadonlyNode.dataset.existingSlug) {
      slugReadonlyNode.dataset.existingSlug = existingSlug;
    }

    if (existingSlug && existingSlug !== "-" && !slugReadonlyNode.dataset.isNewObject) {
      slugReadonlyNode.innerHTML = "<code>" + existingSlug + "</code>";
      return;
    }

    var base = slugify(titleInput.value);
    if (!base) {
      slugReadonlyNode.innerHTML = "<code>Start typing title to preview...</code>";
      return;
    }
    slugReadonlyNode.innerHTML = "<code>" + base + "-[serial-on-save]</code>";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var titleInput = document.getElementById("id_title");
    var slugReadonlyNode = document.querySelector(".field-slug .readonly");
    if (!titleInput || !slugReadonlyNode) return;

    var initialSlug = (slugReadonlyNode.textContent || "").trim();
    if (!initialSlug || initialSlug === "-") {
      slugReadonlyNode.dataset.isNewObject = "1";
    }

    titleInput.addEventListener("input", updatePreview);
    titleInput.addEventListener("change", updatePreview);
    updatePreview();
  });
})();
