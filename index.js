/**
 * AccessiText — Text Accessibility Analyzer & Simplifier
 * 
 * A tool that helps content creators make their writing accessible to people
 * with cognitive disabilities, low literacy levels, or non-native speakers.
 * 
 * Features:
 * - Flesch-Kincaid readability scoring
 * - Sentence complexity analysis
 * - Jargon and complex word detection with simpler alternatives
 * - Passive voice detection
 * - Accessibility grade and actionable recommendations
 * - WCAG 2.1 cognitive accessibility guideline alignment
 */

class TextAnalyzer {
  constructor() {
    this.complexWordMap = {
      'utilize': 'use', 'implement': 'set up', 'facilitate': 'help',
      'subsequent': 'next', 'approximately': 'about', 'commence': 'start',
      'terminate': 'end', 'endeavor': 'try', 'sufficient': 'enough',
      'demonstrate': 'show', 'accomplish': 'do', 'acquisition': 'getting',
      'additional': 'more', 'adequate': 'enough', 'aggregate': 'total',
      'allocate': 'give', 'anticipate': 'expect', 'apparent': 'clear',
      'approximately': 'about', 'ascertain': 'find out', 'assist': 'help',
      'beneficial': 'helpful', 'capability': 'ability', 'collaborate': 'work together',
      'compensate': 'pay', 'component': 'part', 'comprehensive': 'complete',
      'constitute': 'make up', 'correspond': 'match', 'deficiency': 'lack',
      'determine': 'find out', 'discontinue': 'stop', 'disseminate': 'spread',
      'distinguish': 'tell apart', 'eliminate': 'remove', 'emphasize': 'stress',
      'encounter': 'meet', 'equivalent': 'equal', 'establish': 'set up',
      'evaluate': 'check', 'excessive': 'too much', 'expedite': 'speed up',
      'fundamental': 'basic', 'generate': 'make', 'identical': 'same',
      'incorporate': 'include', 'indicate': 'show', 'initiate': 'start',
      'inquire': 'ask', 'magnitude': 'size', 'methodology': 'method',
      'modify': 'change', 'monitor': 'watch', 'necessitate': 'need',
      'numerous': 'many', 'obtain': 'get', 'participate': 'take part',
      'perceive': 'see', 'possess': 'have', 'predominantly': 'mainly',
      'prioritize': 'rank', 'procure': 'get', 'proficiency': 'skill',
      'prohibit': 'ban', 'provision': 'supply', 'purchase': 'buy',
      'regarding': 'about', 'reimburse': 'pay back', 'remainder': 'rest',
      'remuneration': 'pay', 'requirement': 'need', 'residence': 'home',
      'retain': 'keep', 'scrutinize': 'examine', 'significantly': 'greatly',
      'solicit': 'ask for', 'straightforward': 'simple', 'subsequently': 'later',
      'substantial': 'large', 'sufficient': 'enough', 'supplement': 'add to',
      'transmit': 'send', 'transparent': 'clear', 'verification': 'proof',
      'whereas': 'while', 'notwithstanding': 'despite', 'aforementioned': 'mentioned',
      'heretofore': 'until now', 'furthermore': 'also', 'nevertheless': 'still',
      'consequently': 'so', 'henceforth': 'from now on', 'inasmuch': 'since',
      'cognizant': 'aware', 'efficacious': 'effective', 'ameliorate': 'improve',
      'exacerbate': 'worsen', 'ubiquitous': 'everywhere', 'paradigm': 'model',
      'synergy': 'teamwork', 'leverage': 'use', 'juxtapose': 'compare',
      'promulgate': 'announce', 'elucidate': 'explain', 'obfuscate': 'confuse',
      'proliferate': 'spread', 'requisite': 'needed', 'conducive': 'helpful',
      'mitigate': 'reduce', 'perpetuate': 'continue', 'precipitate': 'cause',
      'delineate': 'outline', 'corroborate': 'confirm', 'substantiate': 'prove'
    };

    this.passiveIndicators = [
      'is being', 'was being', 'has been', 'have been', 'had been',
      'will be', 'will have been', 'is done', 'was done', 'were done',
      'is made', 'was made', 'were made', 'is given', 'was given',
      'is taken', 'was taken', 'is shown', 'was shown', 'is known',
      'was known', 'is seen', 'was seen', 'is used', 'was used',
      'is found', 'was found', 'is called', 'was called',
      'is considered', 'was considered', 'is expected', 'was expected',
      'is required', 'was required', 'is needed', 'was needed'
    ];
  }

  countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 2) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? Math.max(matches.length, 1) : 1;
  }

  tokenize(text) {
    return text.split(/\s+/).filter(w => w.length > 0);
  }

  getSentences(text) {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  }

  fleschKincaidGrade(words, sentences, syllables) {
    if (sentences === 0 || words === 0) return 0;
    return 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
  }

  fleschReadingEase(words, sentences, syllables) {
    if (sentences === 0 || words === 0) return 0;
    return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  }

  colemanLiauIndex(text, words, sentences) {
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const L = (letters / words) * 100;
    const S = (sentences / words) * 100;
    return 0.0588 * L - 0.296 * S - 15.8;
  }

  automatedReadabilityIndex(text, words, sentences) {
    const chars = (text.match(/[a-zA-Z0-9]/g) || []).length;
    if (sentences === 0 || words === 0) return 0;
    return 4.71 * (chars / words) + 0.5 * (words / sentences) - 21.43;
  }
}

class AccessibilityScorer {
  constructor() {
    this.analyzer = new TextAnalyzer();
  }

  getGradeLabel(grade) {
    if (grade <= 5) return 'Very Easy (Elementary)';
    if (grade <= 8) return 'Easy (Middle School)';
    if (grade <= 12) return 'Moderate (High School)';
    if (grade <= 16) return 'Difficult (College)';
    return 'Very Difficult (Graduate+)';
  }

  getAccessibilityGrade(score) {
    if (score >= 90) return { grade: 'A+', label: 'Excellent', color: '🟢' };
    if (score >= 80) return { grade: 'A', label: 'Very Good', color: '🟢' };
    if (score >= 70) return { grade: 'B', label: 'Good', color: '🟡' };
    if (score >= 60) return { grade: 'C', label: 'Adequate', color: '🟡' };
    if (score >= 50) return { grade: 'D', label: 'Needs Work', color: '🟠' };
    return { grade: 'F', label: 'Inaccessible', color: '🔴' };
  }

  computeAccessibilityScore(metrics) {
    let score = 100;

    // Penalize high reading grade level
    if (metrics.fleschKincaidGrade > 12) score -= 25;
    else if (metrics.fleschKincaidGrade > 8) score -= 15;
    else if (metrics.fleschKincaidGrade > 6) score -= 5;

    // Penalize low reading ease
    if (metrics.fleschReadingEase < 30) score -= 25;
    else if (metrics.fleschReadingEase < 50) score -= 15;
    else if (metrics.fleschReadingEase < 60) score -= 5;

    // Penalize long sentences
    if (metrics.avgWordsPerSentence > 25) score -= 15;
    else if (metrics.avgWordsPerSentence > 20) score -= 8;

    // Penalize complex word density
    const complexRatio = metrics.complexWordCount / Math.max(metrics.wordCount, 1);
    if (complexRatio > 0.15) score -= 15;
    else if (complexRatio > 0.08) score -= 8;

    // Penalize passive voice
    const passiveRatio = metrics.passiveCount / Math.max(metrics.sentenceCount, 1);
    if (passiveRatio > 0.3) score -= 10;
    else if (passiveRatio > 0.15) score -= 5;

    // Penalize very long paragraphs (by sentence count proxy)
    if (metrics.longestSentenceWords > 40) score -= 10;
    else if (metrics.longestSentenceWords > 30) score -= 5;

    return Math.max(0, Math.min(100, score));
  }
}

class SimplificationEngine {
  constructor(analyzer) {
    this.analyzer = analyzer;
  }

  simplifySentence(sentence) {
    let simplified = sentence;
    const wordsInSentence = sentence.toLowerCase().split(/\s+/);
    const replacements = [];

    for (const word of wordsInSentence) {
      const clean = word.replace(/[^a-z]/g, '');
      if (this.analyzer.complexWordMap[clean]) {
        replacements.push({ original: clean, suggestion: this.analyzer.complexWordMap[clean] });
        const regex = new RegExp(`\\b${clean}\\b`, 'gi');
        simplified = simplified.replace(regex, this.analyzer.complexWordMap[clean]);
      }
    }

    return { simplified, replacements };
  }

  breakLongSentence(sentence) {
    const words = sentence.split(/\s+/);
    if (words.length <= 20) return [sentence];

    // Try splitting on conjunctions and transitional phrases
    const splitPoints = [', and ', ', but ', ', however ', ', therefore ', '; ', ', which ', ', although ', ', because '];
    for (const point of splitPoints) {
      if (sentence.includes(point)) {
        const parts = sentence.split(point).map(p => p.trim());
        return parts.filter(p => p.length > 0).map((p, i) => {
          if (i > 0 && !p.match(/^[A-Z]/)) {
            return p.charAt(0).toUpperCase() + p.slice(1);
          }
          return p;
        });
      }
    }
    return [sentence];
  }
}

class AccessiText {
  constructor() {
    this.analyzer = new TextAnalyzer();
    this.scorer = new AccessibilityScorer();
    this.simplifier = new SimplificationEngine(this.analyzer);
  }

  analyze(text) {
    if (!text || text.trim().length === 0) {
      return { error: 'No text provided for analysis.' };
    }

    const words = this.analyzer.tokenize(text);
    const sentences = this.analyzer.getSentences(text);
    const wordCount = words.length;
    const sentenceCount = sentences.length;

    // Syllable count
    let totalSyllables = 0;
    const polysyllabicWords = [];
    for (const word of words) {
      const syllables = this.analyzer.countSyllables(word);
      totalSyllables += syllables;
      if (syllables >= 3) polysyllabicWords.push(word.toLowerCase());
    }

    // Complex words
    const complexWords = [];
    const suggestions = {};
    for (const word of words) {
      const clean = word.toLowerCase().replace(/[^a-z]/g, '');
      if (this.analyzer.complexWordMap[clean]) {
        if (!complexWords.includes(clean)) {
          complexWords.push(clean);
          suggestions[clean] = this.analyzer.complexWordMap[clean];
        }
      }
    }

    // Passive voice
    const textLower = text.toLowerCase();
    let passiveCount = 0;
    const passiveInstances = [];
    for (const indicator of this.analyzer.passiveIndicators) {
      if (textLower.includes(indicator)) {
        passiveCount++;
        passiveInstances.push(indicator);
      }
    }

    // Sentence analysis
    const sentenceLengths = sentences.map(s => this.analyzer.tokenize(s).length);
    const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    const longestSentenceWords = Math.max(...sentenceLengths, 0);
    const longSentences = sentences.filter(s => this.analyzer.tokenize(s).length > 25);

    // Readability scores
    const fkGrade = this.analyzer.fleschKincaidGrade(wordCount, sentenceCount, totalSyllables);
    const fkEase = this.analyzer.fleschReadingEase(wordCount, sentenceCount, totalSyllables);
    const colemanLiau = this.analyzer.colemanLiauIndex(text, wordCount, sentenceCount);
    const ari = this.analyzer.automatedReadabilityIndex(text, wordCount, sentenceCount);

    const metrics = {
      wordCount, sentenceCount, totalSyllables,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      longestSentenceWords,
      complexWordCount: complexWords.length,
      passiveCount,
      fleschKincaidGrade: Math.round(fkGrade * 10) / 10,
      fleschReadingEase: Math.round(fkEase * 10) / 10,
      colemanLiauIndex: Math.round(colemanLiau * 10) / 10,
      automatedReadabilityIndex: Math.round(ari * 10) / 10
    };

    const accessibilityScore = this.scorer.computeAccessibilityScore(metrics);
    const gradeInfo = this.scorer.getAccessibilityGrade(accessibilityScore);
    const readingLevel = this.scorer.getGradeLabel(fkGrade);

    // Generate recommendations
    const recommendations = this.generateRecommendations(metrics, complexWords, longSentences, passiveInstances);

    // Generate simplified version
    const simplified = this.generateSimplifiedVersion(text);

    return {
      summary: {
        accessibilityScore,
        grade: gradeInfo.grade,
        gradeLabel: gradeInfo.label,
        indicator: gradeInfo.color,
        readingLevel,
        targetAudience: this.getTargetAudience(fkGrade)
      },
      metrics,
      issues: {
        complexWords: { count: complexWords.length, words: complexWords, suggestions },
        longSentences: { count: longSentences.length, sentences: longSentences.map(s => s.trim().substring(0, 80) + '...') },
        passiveVoice: { count: passiveCount, instances: passiveInstances }
      },
      recommendations,
      simplifiedVersion: simplified,
      wcagAlignment: this.getWCAGNotes(accessibilityScore)
    };
  }

  getTargetAudience(grade) {
    if (grade <= 6) return 'General public, including people with cognitive disabilities and non-native speakers';
    if (grade <= 8) return 'Most adults, some difficulty for low-literacy readers';
    if (grade <= 12) return 'Educated adults; excludes many people with cognitive disabilities';
    return 'Specialists only; inaccessible to general public';
  }

  generateRecommendations(metrics, complexWords, longSentences, passiveInstances) {
    const recs = [];

    if (metrics.fleschKincaidGrade > 8) {
      recs.push({
        priority: 'HIGH',
        category: 'Reading Level',
        issue: `Reading grade level is ${metrics.fleschKincaidGrade} (target: 6-8 for accessibility)`,
        action: 'Shorten sentences, replace complex words, use active voice'
      });
    }

    if (metrics.avgWordsPerSentence > 20) {
      recs.push({
        priority: 'HIGH',
        category: 'Sentence Length',
        issue: `Average sentence length is ${metrics.avgWordsPerSentence} words (target: under 20)`,
        action: 'Break long sentences into shorter ones. Aim for one idea per sentence.'
      });
    }

    if (complexWords.length > 0) {
      recs.push({
        priority: 'MEDIUM',
        category: 'Word Choice',
        issue: `Found ${complexWords.length} complex words that have simpler alternatives`,
        action: `Replace: ${complexWords.slice(0, 5).map(w => `"${w}" → "${this.analyzer.complexWordMap[w]}"`).join(', ')}`
      });
    }

    if (passiveInstances.length > 0) {
      recs.push({
        priority: 'MEDIUM',
        category: 'Voice',
        issue: `Found ${passiveInstances.length} passive voice constructions`,
        action: 'Rewrite in active voice. Example: "The form was submitted" → "You submitted the form"'
      });
    }

    if (metrics.longestSentenceWords > 30) {
      recs.push({
        priority: 'HIGH',
        category: 'Sentence Complexity',
        issue: `Longest sentence has ${metrics.longestSentenceWords} words`,
        action: 'Split into multiple sentences. No sentence should exceed 25 words for accessibility.'
      });
    }

    if (recs.length === 0) {
      recs.push({
        priority: 'INFO',
        category: 'Overall',
        issue: 'No major accessibility issues found',
        action: 'Text is well-suited for a broad audience. Continue following plain language principles.'
      });
    }

    return recs;
  }

  generateSimplifiedVersion(text) {
    const sentences = this.analyzer.getSentences(text);
    const simplified = [];

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (!trimmed) continue;

      // Replace complex words
      const { simplified: simpler } = this.simplifier.simplifySentence(trimmed);

      // Break long sentences
      const broken = this.simplifier.breakLongSentence(simpler);
      simplified.push(...broken);
    }

    return simplified.join('. ').replace(/\.\./g, '.') + '.';
  }

  getWCAGNotes(score) {
    const notes = [
      'WCAG 2.1 Success Criterion 3.1.5 (Reading Level): Content should be written at lower secondary education level.',
      'WCAG 2.1 Guideline 3.1 (Readable): Make text content readable and understandable.'
    ];

    if (score < 60) {
      notes.push('⚠️ This text likely fails WCAG 3.1.5. Consider providing a simplified summary.');
    } else if (score >= 80) {
      notes.push('✅ This text aligns well with WCAG cognitive accessibility guidelines.');
    }

    return notes;
  }
}

// === Demo / Main ===
function main() {
  const tool = new AccessiText();

  // Example 1: Complex government/legal text
  const complexText = `
    The aforementioned regulatory framework necessitates comprehensive evaluation 
    of all subsequent environmental impact assessments. Notwithstanding the 
    provisions established heretofore, organizations must endeavor to facilitate 
    transparent communication regarding the implementation of remediation 
    methodologies. The acquisition of sufficient resources is required to 
    accomplish these objectives, and all stakeholders should be cognizant of 
    the requisite procedures that have been promulgated by the governing body.
  `;

  // Example 2: Already accessible text
  const simpleText = `
    We need to check how our work affects the environment. Even though we have 
    rules in place, we must try to share information clearly about how we fix 
    problems. We need enough resources to get this done. Everyone involved 
    should know about the steps that the leaders have announced.
  `;

  console.log('=' .repeat(70));
  console.log('  AccessiText — Text Accessibility Analyzer & Simplifier');
  console.log('=' .repeat(70));

  console.log('\n📋 ANALYSIS 1: Complex Regulatory Text\n');
  const result1 = tool.analyze(complexText);
  printReport(result1);

  console.log('\n\n📋 ANALYSIS 2: Plain Language Version\n');
  const result2 = tool.analyze(simpleText);
  printReport(result2);

  // Interactive analysis function for external use
  console.log('\n\n📖 HOW TO USE:');
  console.log('  const tool = new AccessiText();');
  console.log('  const report = tool.analyze("Your text here...");');
  console.log('  // report contains: summary, metrics, issues, recommendations, simplifiedVersion');
}

function printReport(result) {
  const s = result.summary;
  console.log(`  ${s.indicator} Accessibility Score: ${s.accessibilityScore}/100 (${s.grade} — ${s.gradeLabel})`);
  console.log(`  📚 Reading Level: ${s.readingLevel}`);
  console.log(`  👥 Target Audience: ${s.targetAudience}`);

  const m = result.metrics;
  console.log(`\n  📊 Metrics:`);
  console.log(`     Words: ${m.wordCount} | Sentences: ${m.sentenceCount}`);
  console.log(`     Avg words/sentence: ${m.avgWordsPerSentence}`);
  console.log(`     Flesch-Kincaid Grade: ${m.fleschKincaidGrade}`);
  console.log(`     Flesch Reading Ease: ${m.fleschReadingEase}`);
  console.log(`     Coleman-Liau Index: ${m.colemanLiauIndex}`);

  if (result.issues.complexWords.count > 0) {
    console.log(`\n  ⚠️  Complex Words (${result.issues.complexWords.count}):`);
    const sugg = result.issues.complexWords.suggestions;
    Object.entries(sugg).slice(0, 8).forEach(([word, alt]) => {
      console.log(`     "${word}" → "${alt}"`);
    });
  }

  if (result.issues.passiveVoice.count > 0) {
    console.log(`\n  ⚠️  Passive Voice (${result.issues.passiveVoice.count} instances)`);
  }

  console.log(`\n  💡 Recommendations:`);
  result.recommendations.forEach(r => {
    console.log(`     [${r.priority}] ${r.category}: ${r.action}`);
  });

  console.log(`\n  ✏️  Simplified Version:`);
  console.log(`     ${result.simplifiedVersion.substring(0, 200)}...`);

  console.log(`\n  📐 WCAG Alignment:`);
  result.wcagAlignment.forEach(n => console.log(`     ${n}`));
}

main();
