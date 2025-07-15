export function getRootCssStyles(rootRule = ":root") {
    // Get all CSS rules for the document using Array methods
    const cssRulesArray = [...document.styleSheets]
        .map(styleSheet => {
            try {
                return [...styleSheet.cssRules]
                    .map(rule => rule)
            } catch (e) {
                // console.debug('Access to stylesheet %s is denied. Ignoring...', styleSheet.href);
            }
        })

    var cssVars = [];
    // Get custom styles from root css rule 
    Object.values(cssRulesArray).forEach(arrayElement => {
        Object.values(arrayElement).forEach(ruleElement => {
            if (ruleElement.selectorText === rootRule) {
                Object.values(ruleElement.style).forEach(style => {
                    if (style.startsWith('--spine-') && cssVars.indexOf(style) == -1) {
                        cssVars.push(style);
                    }
                })
            }
        })
    })

    return cssVars;
}

export function calculateTotalValue(coins) {
  // Somma in centesimi (interi)
  const totalCents = coins.reduce((total, coin) => {
    if (!coin.value) return total;

    const match = coin.value.match(/(\d+)/);
    if (match) {
      let valueNumber = parseInt(match[1], 10);
      if (coin.value.includes("Centesimi")) {
        // Già in centesimi
        return total + valueNumber;
      } else if (coin.value.includes("Euro")) {
        // Converti euro in centesimi
        return total + (valueNumber * 100);
      }
    }
    
    return total;
  }, 0);

  // Converte in euro
  return totalCents / 100;
}




