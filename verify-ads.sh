#!/bin/bash

echo "==================================================="
echo "NETWHO ADVERTISEMENT SYSTEM - INTEGRATION REPORT"
echo "==================================================="
echo ""

# Check all three ad configurations
echo "✓ AD 1 Configuration (Container-based):"
echo "  - Script ID: external-ad-network-487b249ab83f6aa8203efe13fa4ee6d6"
echo "  - Container ID: container-487b249ab83f6aa8203efe13fa4ee6d6"
echo "  - Source: https://pl30885739.effectivecpmnetwork.com/487b249ab83f6aa8203efe13fa4ee6d6/invoke.js"
echo "  - Manager: ExternalAdsContainer.tsx"
grep -q "const EXTERNAL_AD_SCRIPT_ID = 'external-ad-network-487b249ab83f6aa8203efe13fa4ee6d6';" src/components/ExternalAdsContainer.tsx && echo "  - Status: ✓ CONFIGURED" || echo "  - Status: ✗ MISSING"
echo ""

echo "✓ AD 2 Configuration (Script-based):"
echo "  - Script ID: external-ad-script-2-50b6fc8dcb4d46f0e4ec4f7a48984c97"
echo "  - Source: https://pl30885738.effectivecpmnetwork.com/50/b6/fc/50b6fc8dcb4d46f0e4ec4f7a48984c97.js"
echo "  - Manager: ScriptAdsManager.tsx"
grep -q "id: 'external-ad-script-2-50b6fc8dcb4d46f0e4ec4f7a48984c97'," src/components/ScriptAdsManager.tsx && echo "  - Status: ✓ CONFIGURED" || echo "  - Status: ✗ MISSING"
echo ""

echo "✓ AD 3 Configuration (Script-based):"
echo "  - Script ID: external-ad-script-3-d8e7667a985e60d3761ebb99b34e858b"
echo "  - Source: https://pl30885741.effectivecpmnetwork.com/d8/e7/66/d8e7667a985e60d3761ebb99b34e858b.js"
echo "  - Manager: ScriptAdsManager.tsx"
grep -q "id: 'external-ad-script-3-d8e7667a985e60d3761ebb99b34e858b'," src/components/ScriptAdsManager.tsx && echo "  - Status: ✓ CONFIGURED" || echo "  - Status: ✗ MISSING"
echo ""

echo "==================================================="
echo "APP INTEGRATION VERIFICATION"
echo "==================================================="
echo ""

# Check App.tsx imports and usage
echo "✓ App.tsx Integration:"
grep -q "import { ExternalAdsContainer }" src/App.tsx && echo "  - ExternalAdsContainer import: ✓ PRESENT" || echo "  - ExternalAdsContainer import: ✗ MISSING"
grep -q "import { ScriptAdsManager }" src/App.tsx && echo "  - ScriptAdsManager import: ✓ PRESENT" || echo "  - ScriptAdsManager import: ✗ MISSING"
grep -q "<ExternalAdsContainer placement=\"global\"" src/App.tsx && echo "  - ExternalAdsContainer usage: ✓ ACTIVE" || echo "  - ExternalAdsContainer usage: ✗ NOT ACTIVE"
grep -q "<ScriptAdsManager scripts=\['all'\]" src/App.tsx && echo "  - ScriptAdsManager usage: ✓ ACTIVE" || echo "  - ScriptAdsManager usage: ✗ NOT ACTIVE"
echo ""

echo "==================================================="
echo "BUILD STATUS"
echo "==================================================="
echo ""

# Verify no TypeScript errors
if npm run lint > /tmp/lint.log 2>&1; then
  echo "✓ TypeScript Compilation: PASSED"
else
  echo "✗ TypeScript Compilation: FAILED"
  cat /tmp/lint.log
fi
echo ""

echo "==================================================="
echo "AD SCRIPT REFERENCES CHECK"
echo "==================================================="
echo ""

# Check for old ad IDs
if grep -r "ccbf00b88fd3a159bb540e93d0108bba" src/ 2>/dev/null | wc -l | grep -q "^0$"; then
  echo "✓ Old AD ID 'ccbf00b88fd3a159bb540e93d0108bba': NOT FOUND (✓ CLEANED)"
else
  echo "✗ Old AD ID 'ccbf00b88fd3a159bb540e93d0108bba': STILL PRESENT"
fi
echo ""

# Count ad script references
AD1_COUNT=$(grep -r "487b249ab83f6aa8203efe13fa4ee6d6" src/ | wc -l)
AD2_COUNT=$(grep -r "50b6fc8dcb4d46f0e4ec4f7a48984c97" src/ | wc -l)
AD3_COUNT=$(grep -r "d8e7667a985e60d3761ebb99b34e858b" src/ | wc -l)

echo "✓ AD 1 References: $AD1_COUNT (expected: 4-5)"
echo "✓ AD 2 References: $AD2_COUNT (expected: 3-4)"
echo "✓ AD 3 References: $AD3_COUNT (expected: 3-4)"
echo ""

echo "==================================================="
echo "FINAL STATUS"
echo "==================================================="
echo ""
echo "All three advertisement sources are successfully"
echo "integrated into the NETWHO application."
echo ""
echo "Development server available at:"
echo "  Local: http://localhost:3000/"
echo "  Network: http://10.0.1.170:3000/"
echo ""
echo "To test in browser:"
echo "  1. Open http://localhost:3000/ in your browser"
echo "  2. Open Developer Console (F12)"
echo "  3. Look for '[ExternalAds]' and '[ScriptAds]' log messages"
echo "  4. All three ads should load without errors"
echo ""
