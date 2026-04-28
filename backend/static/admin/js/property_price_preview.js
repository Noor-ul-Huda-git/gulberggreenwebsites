(function () {
  function parsePrice(value) {
    if (!value) return null

    const normalized = String(value)
      .replace(/,/g, '')
      .replace(/[^\d.]/g, '')

    if (!normalized) return null

    const amount = Number(normalized)
    return Number.isFinite(amount) && amount > 0 ? amount : null
  }

  function trimDecimal(value) {
    return value.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')
  }

  function formatPkrCompact(amount) {
    if (amount >= 10000000) {
      return `${trimDecimal((amount / 10000000).toFixed(2))} Crore`
    }

    if (amount >= 100000) {
      return `${trimDecimal((amount / 100000).toFixed(2))} Lac`
    }

    if (amount >= 1000) {
      return `${trimDecimal((amount / 1000).toFixed(2))} Thousand`
    }

    return amount.toLocaleString('en-PK')
  }

  function setupPricePreview() {
    const input = document.getElementById('id_price')
    if (!input || document.getElementById('price-readable-preview')) return

    const preview = document.createElement('span')
    preview.id = 'price-readable-preview'
    preview.setAttribute('aria-live', 'polite')
    preview.style.display = 'inline-flex'
    preview.style.alignItems = 'center'
    preview.style.marginLeft = '12px'
    preview.style.padding = '6px 10px'
    preview.style.border = '1px solid rgba(49, 201, 80, 0.35)'
    preview.style.borderRadius = '8px'
    preview.style.background = 'rgba(49, 201, 80, 0.08)'
    preview.style.color = '#15803d'
    preview.style.fontWeight = '600'
    preview.style.fontSize = '13px'
    preview.style.lineHeight = '1.2'
    preview.style.minHeight = '30px'

    input.insertAdjacentElement('afterend', preview)

    function updatePreview() {
      const amount = parsePrice(input.value)
      if (!amount) {
        preview.textContent = 'Enter price'
        preview.style.color = '#64748b'
        preview.style.borderColor = 'rgba(148, 163, 184, 0.4)'
        preview.style.background = 'rgba(248, 250, 252, 0.9)'
        return
      }

      preview.textContent = formatPkrCompact(amount)
      preview.style.color = '#15803d'
      preview.style.borderColor = 'rgba(49, 201, 80, 0.35)'
      preview.style.background = 'rgba(49, 201, 80, 0.08)'
    }

    input.addEventListener('input', updatePreview)
    input.addEventListener('change', updatePreview)
    updatePreview()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPricePreview)
  } else {
    setupPricePreview()
  }
})()
