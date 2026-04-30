/**
 * News admin: slug stays read-only; show a live preview from the title (suffix digits are added on save).
 */
(function () {
  function slugify(value) {
    if (!value) return ''
    return value
      .toString()
      .toLowerCase()
      .trim()
      .replace(/['"]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  document.addEventListener('DOMContentLoaded', function () {
    var titleEl = document.getElementById('id_title')
    var slugWrap =
      document.getElementById('div_id_slug') ||
      document.querySelector('.form-group.field-slug') ||
      document.querySelector('.field-slug')
    if (!titleEl || !slugWrap) return

    var hint = document.createElement('p')
    hint.className = 'help'
    hint.style.marginTop = '0.35rem'
    hint.innerHTML =
      '<strong>Live preview</strong> (from title): <code id="news-slug-live-preview" style="font-size:0.95em"></code>' +
      '<span class="mx-1 text-muted">+</span>' +
      '<span class="text-muted" style="font-size:0.85em">10 random digits on save (same as property listings)</span>'
    slugWrap.appendChild(hint)

    var out = document.getElementById('news-slug-live-preview')

    function sync() {
      var base = slugify(titleEl.value) || 'news'
      out.textContent = base
    }

    titleEl.addEventListener('input', sync)
    titleEl.addEventListener('change', sync)
    sync()
  })
})()
