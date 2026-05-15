import { mockData as aqasem } from './src/mockData/aqasem.js';
import { mockData as rrh } from './src/mockData/rrh.js';
import { mockData as howladar } from './src/mockData/howladar.js';
import { mockData as syful } from './src/mockData/syful.js';
import { mockData as islam } from './src/mockData/islam.js';

const firms = { aqasem, rrh, howladar, syful, islam };

for (const [key, data] of Object.entries(firms)) {
  console.log(`Checking ${key}...`);
  
  if (JSON.stringify(data.financials.years) !== JSON.stringify(["2023", "2024", "2025"])) {
    console.error(`  ${key}: financials.years is not ["2023", "2024", "2025"]`);
  }
  
  if (data.ratios.dscr.length !== 3 || !data.ratios.dscr.every(n => typeof n === 'number' && n > 0)) {
    console.error(`  ${key}: ratios.dscr is invalid`);
  }
  
  if (typeof data.regulatory.icrrScore !== 'number' || data.regulatory.icrrScore < 1 || data.regulatory.icrrScore > 100) {
    console.error(`  ${key}: regulatory.icrrScore is invalid`);
  }
  
  const validBands = ["Strong", "Good", "Acceptable", "Marginal", "Weak"];
  if (!validBands.includes(data.regulatory.icrrBand)) {
    console.error(`  ${key}: regulatory.icrrBand is invalid`);
  }
  
  const narrativeKeys = ['executiveSummary', 'financialPerformance', 'liquidityWorkingCapital', 'leverageDebt', 'covenantCompliance', 'riskFlags', 'recommendation'];
  for (const nKey of narrativeKeys) {
    if (typeof data.narrativeSections[nKey] !== 'string' || data.narrativeSections[nKey].trim() === '') {
      console.error(`  ${key}: narrativeSections.${nKey} is invalid`);
    }
  }
  
  const borrowerKeys = ['sector', 'subSector', 'established', 'employees', 'facilityType', 'facilityLimit', 'facilityOutstanding', 'lastReviewDate', 'nextReviewDue', 'relationshipYears', 'collateral'];
  for (const bKey of borrowerKeys) {
    if (typeof data.borrowerDetails[bKey] !== 'string' || data.borrowerDetails[bKey].trim() === '') {
      console.error(`  ${key}: borrowerDetails.${bKey} is invalid`);
    }
  }
  
  const scores = data.reliabilityScores;
  const sum = scores.completeness + scores.consistency + scores.auditorQuality + scores.cashFlowMatch + scores.taxAlignment;
  if (scores.total !== sum) {
    console.error(`  ${key}: reliabilityScores.total (${scores.total}) !== sum (${sum})`);
  }
}
console.log('Done.');
