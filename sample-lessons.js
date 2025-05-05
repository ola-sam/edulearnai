/**
 * Sample lessons and quizzes for US school curriculum grades 1-12 
 * for Mathematics, English, and Science subjects
 */

// MATHEMATICS LESSONS
const mathLessons = [
  // Grade 1
  {
    title: "Counting to 100",
    description: "Learn to count numbers from 1 to 100 with fun exercises and visual aids.",
    content: `
      <h1>Counting to 100</h1>
      <p>Let's learn how to count all the way to 100!</p>
      
      <h2>Count by Ones</h2>
      <p>Start at 1 and count one at a time: 1, 2, 3, 4, 5...</p>
      <div class="interactive-activity">
        <p>Click on the numbers in order from 1 to 20.</p>
        <div class="number-grid">
          [Interactive number grid element]
        </div>
      </div>
      
      <h2>Count by Tens</h2>
      <p>We can also count faster by jumping by tens: 10, 20, 30, 40, 50...</p>
      <div class="interactive-activity">
        <p>Connect the dots by counting by tens.</p>
        [Interactive connect-the-dots element]
      </div>
      
      <h2>Let's Practice!</h2>
      <p>Fill in the missing numbers:</p>
      <div class="practice-activity">
        <p>1, 2, 3, ____, 5, ____, 7, 8, ____, 10</p>
        <p>10, 20, ____, 40, ____, 60, ____, 80, ____, 100</p>
      </div>
    `,
    subjectId: 1, // Math
    grade: 1,
    duration: 25,
    difficulty: 1,
    downloadSize: 5000, // 5MB
    downloadUrl: "/lessons/math/counting-to-100"
  },
  
  // Grade 3
  {
    title: "Multiplication Tables",
    description: "Master multiplication tables from 1 to 10 with interactive exercises.",
    content: `
      <h1>Multiplication Tables</h1>
      <p>Multiplication is a faster way of adding the same number many times.</p>
      
      <h2>Understanding Multiplication</h2>
      <p>When we write 3 × 4, it means "3 groups of 4" or "4 + 4 + 4".</p>
      <div class="visual-representation">
        [Visual of 3 groups of 4 objects]
      </div>
      
      <h2>Multiplication Table</h2>
      <div class="multiplication-table">
        [Interactive multiplication table 1-10]
      </div>
      
      <h2>Tips for Learning Tables</h2>
      <ul>
        <li>Multiplying by 1 gives the same number (5 × 1 = 5)</li>
        <li>Multiplying by 2 is like doubling (4 × 2 = 8)</li>
        <li>Multiplying by 10 just adds a zero (6 × 10 = 60)</li>
        <li>Numbers multiplied together give the same answer regardless of order (4 × 6 = 6 × 4)</li>
      </ul>
      
      <h2>Practice Time!</h2>
      <div class="interactive-practice">
        [Interactive practice problems]
      </div>
    `,
    subjectId: 1, // Math
    grade: 3,
    duration: 30,
    difficulty: 2,
    downloadSize: 8000, // 8MB
    downloadUrl: "/lessons/math/multiplication-tables"
  },
  
  // Grade 5
  {
    title: "Fractions and Decimals",
    description: "Learn to convert between fractions and decimals, and perform calculations with them.",
    content: `
      <h1>Fractions and Decimals</h1>
      <p>Fractions and decimals are different ways to represent parts of a whole.</p>
      
      <h2>Understanding Fractions</h2>
      <p>A fraction has two parts:</p>
      <ul>
        <li>Numerator (top number): how many parts we have</li>
        <li>Denominator (bottom number): how many equal parts make up the whole</li>
      </ul>
      <div class="fraction-visual">
        [Visual representation of fractions]
      </div>
      
      <h2>Converting Fractions to Decimals</h2>
      <p>To convert a fraction to a decimal, divide the numerator by the denominator.</p>
      <div class="example">
        <p>1/4 = 1 ÷ 4 = 0.25</p>
        <p>3/5 = 3 ÷ 5 = 0.6</p>
      </div>
      
      <h2>Converting Decimals to Fractions</h2>
      <p>To convert a decimal to a fraction, write the decimal as a fraction with a power of 10 as the denominator, then simplify.</p>
      <div class="example">
        <p>0.75 = 75/100 = 3/4</p>
        <p>0.8 = 8/10 = 4/5</p>
      </div>
      
      <h2>Practice Problems</h2>
      <div class="practice-activity">
        [Interactive practice problems]
      </div>
    `,
    subjectId: 1, // Math
    grade: 5,
    duration: 35,
    difficulty: 3,
    downloadSize: 10000, // 10MB
    downloadUrl: "/lessons/math/fractions-and-decimals"
  },
  
  // Grade 8
  {
    title: "Algebra: Solving Linear Equations",
    description: "Learn to solve for variables in linear equations through step-by-step methods.",
    content: `
      <h1>Solving Linear Equations</h1>
      <p>Linear equations contain variables raised only to the first power.</p>
      
      <h2>Understanding Linear Equations</h2>
      <p>A linear equation can be written in the form ax + b = c, where a, b, and c are numbers, and x is the variable we're solving for.</p>
      
      <h2>Steps to Solve Linear Equations</h2>
      <ol>
        <li>Combine like terms on each side</li>
        <li>Use addition or subtraction to get all variable terms on one side</li>
        <li>Use addition or subtraction to get all constant terms on the other side</li>
        <li>Use multiplication or division to isolate the variable</li>
      </ol>
      
      <h2>Examples</h2>
      <div class="example">
        <p>Solve for x: 3x + 5 = 20</p>
        <ul>
          <li>3x + 5 = 20</li>
          <li>3x = 20 - 5 (subtract 5 from both sides)</li>
          <li>3x = 15</li>
          <li>x = 15/3 (divide both sides by 3)</li>
          <li>x = 5</li>
        </ul>
      </div>
      
      <h2>Practice Problems</h2>
      <div class="practice-activity">
        [Interactive practice problems]
      </div>
    `,
    subjectId: 1, // Math
    grade: 8,
    duration: 40,
    difficulty: 4,
    downloadSize: 12000, // 12MB
    downloadUrl: "/lessons/math/linear-equations"
  },
  
  // Grade 11
  {
    title: "Introduction to Calculus: Limits",
    description: "Understand the concept of limits and how they form the foundation of calculus.",
    content: `
      <h1>Introduction to Calculus: Limits</h1>
      <p>Limits are the foundation of calculus and help us understand how functions behave as their input approaches a specific value.</p>
      
      <h2>Understanding Limits</h2>
      <p>The limit of a function f(x) as x approaches a value a is written as:</p>
      <div class="math-notation">
        <p>lim f(x) as x → a</p>
      </div>
      <p>This represents the value that f(x) gets closer to as x gets closer to a.</p>
      
      <h2>Finding Limits Graphically</h2>
      <p>We can estimate limits by looking at the function's graph and seeing what value the function approaches as x gets closer to a.</p>
      <div class="interactive-graph">
        [Interactive limit graph visualization]
      </div>
      
      <h2>Finding Limits Algebraically</h2>
      <p>For many functions, we can find the limit by direct substitution:</p>
      <div class="example">
        <p>lim (x² + 3x) as x → 2</p>
        <p>= 2² + 3(2)</p>
        <p>= 4 + 6</p>
        <p>= 10</p>
      </div>
      
      <h2>Special Limits</h2>
      <p>Some limits require special techniques:</p>
      <ul>
        <li>Factoring</li>
        <li>Rationalization</li>
        <li>Using special limit rules</li>
      </ul>
      
      <h2>Practice Problems</h2>
      <div class="practice-activity">
        [Interactive practice problems]
      </div>
    `,
    subjectId: 1, // Math
    grade: 11,
    duration: 45,
    difficulty: 5,
    downloadSize: 15000, // 15MB
    downloadUrl: "/lessons/math/calculus-limits"
  }
];

// ENGLISH LESSONS
const englishLessons = [
  // Grade 2
  {
    title: "Reading Comprehension: Short Stories",
    description: "Develop reading skills by understanding characters, setting, and plot in short stories.",
    content: `
      <h1>Reading Comprehension: Short Stories</h1>
      <p>Let's learn how to understand the stories we read!</p>
      
      <h2>Story Elements</h2>
      <p>Every story has important parts:</p>
      <ul>
        <li><b>Characters:</b> The people or animals in the story</li>
        <li><b>Setting:</b> Where and when the story happens</li>
        <li><b>Plot:</b> What happens in the story</li>
      </ul>
      
      <h2>Short Story: "The Lost Puppy"</h2>
      <div class="story-text">
        <p>Max was a small brown puppy. He lived with his owner, Lily, in a blue house with a big yard. One day, Max dug a hole under the fence and got out. He ran around the neighborhood, exploring everything.</p>
        <p>Soon, Max realized he didn't know how to get home. He felt scared. A kind neighbor found Max and read his tag. The neighbor called Lily, who came right away. Max was so happy to see Lily! Lily took Max home and fixed the hole in the fence.</p>
        <p>Max learned that staying in his yard was the safest place to be.</p>
      </div>
      
      <h2>Let's Talk About the Story</h2>
      <div class="comprehension-questions">
        <p><b>Characters:</b> Who is in this story?</p>
        <p><b>Setting:</b> Where does the story take place?</p>
        <p><b>Plot:</b> What happens in this story?</p>
        <p><b>Lesson:</b> What did Max learn?</p>
      </div>
      
      <h2>Activity Time!</h2>
      <div class="interactive-activity">
        <p>Draw a picture of your favorite part of the story.</p>
      </div>
    `,
    subjectId: 2, // English
    grade: 2,
    duration: 30,
    difficulty: 2,
    downloadSize: 7000, // 7MB
    downloadUrl: "/lessons/english/reading-comprehension"
  },
  
  // Grade 4
  {
    title: "Grammar: Parts of Speech",
    description: "Learn to identify and use nouns, verbs, adjectives, and adverbs in sentences.",
    content: `
      <h1>Grammar: Parts of Speech</h1>
      <p>Words have different jobs in sentences. Let's learn about them!</p>
      
      <h2>Nouns</h2>
      <p>Nouns are people, places, things, or ideas.</p>
      <div class="examples">
        <p><b>People:</b> teacher, doctor, sister</p>
        <p><b>Places:</b> school, park, kitchen</p>
        <p><b>Things:</b> book, computer, tree</p>
        <p><b>Ideas:</b> love, courage, freedom</p>
      </div>
      
      <h2>Verbs</h2>
      <p>Verbs show action or state of being.</p>
      <div class="examples">
        <p><b>Action:</b> run, jump, write</p>
        <p><b>State of Being:</b> am, is, are, was, were</p>
      </div>
      
      <h2>Adjectives</h2>
      <p>Adjectives describe nouns.</p>
      <div class="examples">
        <p><b>Examples:</b> tall, blue, happy, five</p>
        <p><b>In a sentence:</b> The <u>tall</u> boy ate a <u>delicious</u> apple.</p>
      </div>
      
      <h2>Adverbs</h2>
      <p>Adverbs describe verbs, adjectives, or other adverbs.</p>
      <div class="examples">
        <p><b>Examples:</b> quickly, very, well, tomorrow</p>
        <p><b>In a sentence:</b> She ran <u>quickly</u>. The test was <u>very</u> easy.</p>
      </div>
      
      <h2>Practice Time!</h2>
      <div class="interactive-activity">
        <p>Identify the parts of speech in these sentences:</p>
        <p>1. The happy dog played in the large park.</p>
        <p>2. She quietly read an interesting book yesterday.</p>
      </div>
    `,
    subjectId: 2, // English
    grade: 4,
    duration: 35,
    difficulty: 3,
    downloadSize: 8000, // 8MB
    downloadUrl: "/lessons/english/parts-of-speech"
  },
  
  // Grade 7
  {
    title: "Essay Writing: The Five-Paragraph Essay",
    description: "Learn how to structure and write effective five-paragraph essays.",
    content: `
      <h1>Essay Writing: The Five-Paragraph Essay</h1>
      <p>The five-paragraph essay is a standard format that helps organize your thoughts clearly.</p>
      
      <h2>Essay Structure</h2>
      <ol>
        <li><b>Introduction:</b> Presents your main idea (thesis statement)</li>
        <li><b>Body Paragraph 1:</b> First supporting point</li>
        <li><b>Body Paragraph 2:</b> Second supporting point</li>
        <li><b>Body Paragraph 3:</b> Third supporting point</li>
        <li><b>Conclusion:</b> Summarizes your main points and restates your thesis</li>
      </ol>
      
      <h2>The Introduction</h2>
      <p>Your introduction should:</p>
      <ul>
        <li>Hook the reader's attention</li>
        <li>Provide background information</li>
        <li>Present your thesis statement (main argument)</li>
      </ul>
      <div class="example">
        <p><b>Example Hook:</b> "Social media has dramatically changed how teenagers communicate in the 21st century."</p>
        <p><b>Example Thesis:</b> "While social media offers benefits like connecting with friends, it has negatively impacted teenagers by reducing face-to-face interaction, causing sleep deprivation, and creating unhealthy comparison habits."</p>
      </div>
      
      <h2>Body Paragraphs</h2>
      <p>Each body paragraph should:</p>
      <ul>
        <li>Start with a topic sentence stating your point</li>
        <li>Provide evidence and examples</li>
        <li>Explain how the evidence supports your point</li>
        <li>Transition to the next paragraph</li>
      </ul>
      
      <h2>The Conclusion</h2>
      <p>Your conclusion should:</p>
      <ul>
        <li>Restate your thesis (in different words)</li>
        <li>Summarize your main points</li>
        <li>End with a final thought or call to action</li>
      </ul>
      
      <h2>Practice</h2>
      <div class="writing-prompt">
        <p>Write a five-paragraph essay on one of these topics:</p>
        <p>1. Should students be required to wear uniforms?</p>
        <p>2. Is technology making us more or less connected?</p>
        <p>3. Should homework be abolished?</p>
      </div>
    `,
    subjectId: 2, // English
    grade: 7,
    duration: 40,
    difficulty: 4,
    downloadSize: 9000, // 9MB
    downloadUrl: "/lessons/english/five-paragraph-essay"
  },
  
  // Grade 10
  {
    title: "Literary Analysis: Themes in Literature",
    description: "Explore how to identify and analyze themes and motifs in literary works.",
    content: `
      <h1>Literary Analysis: Themes in Literature</h1>
      <p>A theme is a central idea or message about life that an author wants to convey to the reader.</p>
      
      <h2>What are Themes?</h2>
      <p>Themes are universal concepts that extend beyond the story itself. They often relate to:</p>
      <ul>
        <li>Human nature</li>
        <li>Society and social issues</li>
        <li>Moral and ethical questions</li>
        <li>Life experiences</li>
      </ul>
      <p>Common themes include: love, identity, power, freedom, justice, prejudice, and coming of age.</p>
      
      <h2>How to Identify Themes</h2>
      <p>Look for:</p>
      <ul>
        <li>Repeated ideas or symbols</li>
        <li>Character development and changes</li>
        <li>Conflicts and their resolutions</li>
        <li>Dialogue and important statements</li>
        <li>The title and its significance</li>
      </ul>
      
      <h2>Motifs vs. Themes</h2>
      <p><b>Motif:</b> A recurring element (image, sound, action) that has symbolic significance.</p>
      <p><b>Theme:</b> The broader message or insight that the motifs help develop.</p>
      
      <h2>Example: "To Kill a Mockingbird"</h2>
      <div class="example-analysis">
        <p><b>Themes:</b></p>
        <ul>
          <li>Racial injustice and prejudice</li>
          <li>Moral growth and education</li>
          <li>Courage and standing up for what's right</li>
        </ul>
        <p><b>Supporting Evidence:</b></p>
        <ul>
          <li>Tom Robinson's trial and conviction despite evidence of his innocence</li>
          <li>Scout's evolving understanding of the world through her experiences</li>
          <li>Atticus's decision to defend Tom despite community pressure</li>
        </ul>
      </div>
      
      <h2>Analysis Practice</h2>
      <div class="practice-activity">
        <p>Choose a book you've read recently and identify:</p>
        <p>1. Two major themes</p>
        <p>2. Evidence from the text that supports these themes</p>
        <p>3. How these themes relate to broader human experience</p>
      </div>
    `,
    subjectId: 2, // English
    grade: 10,
    duration: 45,
    difficulty: 4,
    downloadSize: 11000, // 11MB
    downloadUrl: "/lessons/english/themes-in-literature"
  },
  
  // Grade 12
  {
    title: "Rhetoric and Persuasive Techniques",
    description: "Master the art of persuasion through rhetorical devices and persuasive writing strategies.",
    content: `
      <h1>Rhetoric and Persuasive Techniques</h1>
      <p>Rhetoric is the art of effective communication and persuasion, used in writing, speaking, and media.</p>
      
      <h2>The Rhetorical Triangle</h2>
      <div class="rhetorical-triangle">
        <p><b>Ethos:</b> Appeal to ethics/credibility - Why should the audience trust you?</p>
        <p><b>Pathos:</b> Appeal to emotion - How does the message make the audience feel?</p>
        <p><b>Logos:</b> Appeal to logic - What evidence and reasoning supports the argument?</p>
      </div>
      
      <h2>Rhetorical Devices</h2>
      <ul>
        <li><b>Alliteration:</b> Repetition of initial consonant sounds ("Peter Piper picked a peck...")</li>
        <li><b>Anaphora:</b> Repetition at the beginning of successive clauses ("I have a dream... I have a dream...")</li>
        <li><b>Antithesis:</b> Contrasting ideas in parallel structure ("Ask not what your country can do for you, ask what you can do for your country.")</li>
        <li><b>Hyperbole:</b> Exaggeration for effect ("I've told you a million times.")</li>
        <li><b>Rhetorical Question:</b> Question asked for effect, not for an answer ("How much longer must we wait for justice?")</li>
      </ul>
      
      <h2>Persuasive Techniques</h2>
      <ul>
        <li><b>Appeals to Authority:</b> Citing experts or respected figures</li>
        <li><b>Bandwagon:</b> Suggesting everyone is doing it</li>
        <li><b>Emotional Appeal:</b> Using stories or imagery to evoke emotion</li>
        <li><b>Evidence:</b> Statistics, studies, and facts that support your claim</li>
        <li><b>Counter-Arguments:</b> Addressing opposing viewpoints</li>
      </ul>
      
      <h2>Famous Example: Martin Luther King Jr.'s "I Have a Dream"</h2>
      <div class="speech-analysis">
        <p><b>Ethos:</b> Establishes moral authority by referencing American founding principles</p>
        <p><b>Pathos:</b> Evokes emotion through vivid imagery of future equality</p>
        <p><b>Logos:</b> Cites historical documents (Constitution, Emancipation Proclamation)</p>
        <p><b>Devices:</b> Anaphora ("I have a dream"), metaphor ("Justice rolls down like waters")</p>
      </div>
      
      <h2>Application Exercise</h2>
      <div class="writing-prompt">
        <p>Choose a current issue you care about. Write a persuasive paragraph using at least three rhetorical devices and appealing to ethos, pathos, and logos.</p>
      </div>
    `,
    subjectId: 2, // English
    grade: 12,
    duration: 50,
    difficulty: 5,
    downloadSize: 12000, // 12MB
    downloadUrl: "/lessons/english/rhetoric-persuasive-techniques"
  }
];

// SCIENCE LESSONS
const scienceLessons = [
  // Grade 1
  {
    title: "The Five Senses",
    description: "Explore how we use our five senses to observe and learn about the world around us.",
    content: `
      <h1>The Five Senses</h1>
      <p>Our five senses help us discover the world around us!</p>
      
      <h2>Our Five Senses</h2>
      <ul>
        <li><b>Sight:</b> We use our eyes to see colors, shapes, and objects.</li>
        <li><b>Hearing:</b> We use our ears to hear sounds like music and voices.</li>
        <li><b>Smell:</b> We use our nose to smell flowers, food, and more.</li>
        <li><b>Taste:</b> We use our tongue to taste sweet, sour, salty, and bitter flavors.</li>
        <li><b>Touch:</b> We use our skin to feel if something is hot, cold, soft, or rough.</li>
      </ul>
      
      <h2>Sight</h2>
      <div class="sense-activity">
        <p>What do you see around you? Can you name all the colors you see?</p>
        <p>Try this: Close your eyes for 10 seconds. Open them and notice three things you didn't see before!</p>
      </div>
      
      <h2>Hearing</h2>
      <div class="sense-activity">
        <p>Let's be very quiet for one minute. What sounds do you hear?</p>
        <p>Try this: Make different sounds with classroom objects. Can your friends guess what made the sound?</p>
      </div>
      
      <h2>Smell</h2>
      <div class="sense-activity">
        <p>Our nose helps us smell good things (like cookies) and bad things (like smoke).</p>
        <p>Try this: Can you identify these smells with your eyes closed? (cinnamon, lemon, mint)</p>
      </div>
      
      <h2>Taste</h2>
      <div class="sense-activity">
        <p>Our tongue has special taste buds that help us taste different flavors.</p>
        <p>Try this: Draw a face showing how you feel when you taste something sour like a lemon!</p>
      </div>
      
      <h2>Touch</h2>
      <div class="sense-activity">
        <p>We can feel with our hands if something is soft, rough, bumpy, or smooth.</p>
        <p>Try this: Put your hand in the mystery box. Can you guess what's inside without looking?</p>
      </div>
      
      <h2>Let's Play a Senses Game!</h2>
      <div class="interactive-activity">
        <p>For each item, write which sense you would use to learn about it:</p>
        <p>1. A bell ringing</p>
        <p>2. A bright rainbow</p>
        <p>3. A smooth rock</p>
        <p>4. A sweet apple</p>
        <p>5. A flower's scent</p>
      </div>
    `,
    subjectId: 3, // Science
    grade: 1,
    duration: 25,
    difficulty: 1,
    downloadSize: 6000, // 6MB
    downloadUrl: "/lessons/science/five-senses"
  },
  
  // Grade 4
  {
    title: "The Water Cycle",
    description: "Learn about how water moves through our environment in a continuous cycle.",
    content: `
      <h1>The Water Cycle</h1>
      <p>The water cycle is how water travels around our planet in a never-ending journey.</p>
      
      <h2>The Water Cycle Steps</h2>
      <ol>
        <li><b>Evaporation:</b> Water turns from liquid to gas (water vapor) when heated by the sun.</li>
        <li><b>Condensation:</b> Water vapor cools and forms clouds.</li>
        <li><b>Precipitation:</b> Water falls from clouds as rain, snow, sleet, or hail.</li>
        <li><b>Collection:</b> Water returns to oceans, lakes, rivers, or seeps into the ground.</li>
      </ol>
      
      <div class="water-cycle-diagram">
        [Interactive water cycle diagram]
      </div>
      
      <h2>Evaporation</h2>
      <p>When the sun heats water in oceans, lakes, rivers, and even puddles, some of it turns into water vapor. This invisible gas rises into the air. Plants also release water vapor through a process called transpiration.</p>
      
      <h2>Condensation</h2>
      <p>As water vapor rises higher in the sky, it cools and turns back into tiny water droplets. These droplets cluster together to form clouds. This is the same process you see when steam from a hot shower forms water droplets on a cold mirror.</p>
      
      <h2>Precipitation</h2>
      <p>When the water droplets in clouds get heavy enough, they fall back to Earth as rain. If the air is very cold, the droplets freeze and fall as snow, sleet, or hail instead.</p>
      
      <h2>Collection</h2>
      <p>The fallen water may flow over land into streams, rivers, and eventually back to the ocean. Some water soaks into the ground and becomes groundwater. Plants absorb some of this water through their roots.</p>
      
      <h2>Water Cycle Experiment</h2>
      <div class="experiment">
        <p>Create a mini water cycle:</p>
        <ol>
          <li>Put warm water in a clear bowl</li>
          <li>Cover the bowl with plastic wrap</li>
          <li>Place an ice cube on top of the plastic wrap</li>
          <li>Watch what happens!</li>
        </ol>
      </div>
      
      <h2>Check Your Understanding</h2>
      <div class="interactive-questions">
        <p>1. What provides the energy for evaporation?</p>
        <p>2. What are clouds made of?</p>
        <p>3. Name three forms of precipitation.</p>
        <p>4. Why is the water cycle called a "cycle"?</p>
      </div>
    `,
    subjectId: 3, // Science
    grade: 4,
    duration: 35,
    difficulty: 2,
    downloadSize: 9000, // 9MB
    downloadUrl: "/lessons/science/water-cycle"
  },
  
  // Grade 6
  {
    title: "Cells: The Building Blocks of Life",
    description: "Discover the basic unit of all living things and learn about cell structures and functions.",
    content: `
      <h1>Cells: The Building Blocks of Life</h1>
      <p>Cells are the smallest living units that make up all living organisms, from tiny bacteria to large elephants!</p>
      
      <h2>Cell Discovery</h2>
      <p>In 1665, Robert Hooke looked at a thin slice of cork under a microscope and saw tiny box-like structures. He called them "cells" because they reminded him of the small rooms where monks lived. Later, scientists discovered all living things are made of cells.</p>
      
      <h2>Types of Cells</h2>
      <p>There are two main types of cells:</p>
      <ul>
        <li><b>Prokaryotic cells:</b> Simple cells without a nucleus (like bacteria)</li>
        <li><b>Eukaryotic cells:</b> Complex cells with a nucleus and other organelles (like plant and animal cells)</li>
      </ul>
      
      <h2>Parts of a Cell</h2>
      <div class="cell-diagram">
        [Interactive animal and plant cell diagram]
      </div>
      <p><b>Key Cell Parts:</b></p>
      <ul>
        <li><b>Cell Membrane:</b> The outer covering that controls what enters and leaves the cell</li>
        <li><b>Cytoplasm:</b> Gel-like substance where organelles float</li>
        <li><b>Nucleus:</b> The control center containing DNA (genetic material)</li>
        <li><b>Mitochondria:</b> The powerhouse of the cell where energy is produced</li>
        <li><b>Ribosomes:</b> Where proteins are made</li>
        <li><b>Endoplasmic Reticulum:</b> Transports materials within the cell</li>
        <li><b>Golgi Apparatus:</b> Packages and ships proteins</li>
        <li><b>Lysosomes:</b> Contain enzymes to break down waste and debris</li>
      </ul>
      
      <h2>Plant Cell Special Features</h2>
      <p>Plant cells have additional structures:</p>
      <ul>
        <li><b>Cell Wall:</b> Rigid outer layer that provides support</li>
        <li><b>Chloroplasts:</b> Contain chlorophyll for photosynthesis</li>
        <li><b>Large Vacuole:</b> Stores water and maintains cell shape</li>
      </ul>
      
      <h2>Cell Functions</h2>
      <p>Cells carry out all the functions necessary for life:</p>
      <ul>
        <li>Taking in nutrients</li>
        <li>Converting nutrients to energy</li>
        <li>Carrying out specialized functions</li>
        <li>Reproducing</li>
        <li>Responding to their environment</li>
      </ul>
      
      <h2>Check Your Understanding</h2>
      <div class="interactive-questions">
        <p>1. Compare and contrast plant and animal cells.</p>
        <p>2. What is the function of the mitochondria?</p>
        <p>3. Why are cells called the "building blocks of life"?</p>
        <p>4. Draw and label the parts of an animal cell.</p>
      </div>
    `,
    subjectId: 3, // Science
    grade: 6,
    duration: 40,
    difficulty: 3,
    downloadSize: 10000, // 10MB
    downloadUrl: "/lessons/science/cells-building-blocks"
  },
  
  // Grade 9
  {
    title: "Introduction to Chemistry: Atoms and Elements",
    description: "Learn about the basic building blocks of matter: atoms, elements, and the periodic table.",
    content: `
      <h1>Introduction to Chemistry: Atoms and Elements</h1>
      <p>Everything in our universe is made of matter, and matter is composed of atoms.</p>
      
      <h2>Atoms: The Building Blocks of Matter</h2>
      <p>Atoms are incredibly small particles that are the basic units of matter. They are so small that about 5 million hydrogen atoms could fit across the width of a pencil line!</p>
      
      <h2>Structure of an Atom</h2>
      <div class="atom-diagram">
        [Interactive atom diagram]
      </div>
      <p>Atoms consist of three main particles:</p>
      <ul>
        <li><b>Protons:</b> Positively charged particles in the nucleus</li>
        <li><b>Neutrons:</b> Neutral particles (no charge) in the nucleus</li>
        <li><b>Electrons:</b> Negatively charged particles that orbit the nucleus in energy levels</li>
      </ul>
      
      <h2>Elements</h2>
      <p>An element is a pure substance made of only one type of atom. Examples include oxygen, carbon, gold, and iron.</p>
      <p>Each element is identified by:</p>
      <ul>
        <li><b>Atomic Number:</b> The number of protons in the atom</li>
        <li><b>Mass Number:</b> The total number of protons and neutrons</li>
        <li><b>Symbol:</b> A one or two-letter abbreviation (e.g., O for oxygen, Fe for iron)</li>
      </ul>
      
      <h2>The Periodic Table</h2>
      <div class="periodic-table">
        [Interactive periodic table]
      </div>
      <p>The periodic table organizes all known elements based on their properties and atomic structure. Elements are arranged in:</p>
      <ul>
        <li><b>Periods (rows):</b> Elements in the same period have the same number of electron shells</li>
        <li><b>Groups (columns):</b> Elements in the same group have similar chemical properties</li>
      </ul>
      
      <h2>Element Categories</h2>
      <ul>
        <li><b>Metals:</b> Good conductors of heat and electricity, malleable (e.g., iron, copper)</li>
        <li><b>Nonmetals:</b> Poor conductors, brittle as solids (e.g., oxygen, carbon)</li>
        <li><b>Metalloids:</b> Have properties of both metals and nonmetals (e.g., silicon, boron)</li>
      </ul>
      
      <h2>Isotopes</h2>
      <p>Isotopes are atoms of the same element (same number of protons) but with different numbers of neutrons. For example, Carbon-12, Carbon-13, and Carbon-14 are all isotopes of carbon.</p>
      
      <h2>Check Your Understanding</h2>
      <div class="interactive-questions">
        <p>1. What is the difference between an atom and an element?</p>
        <p>2. What determines which element an atom represents?</p>
        <p>3. How are elements organized in the periodic table?</p>
        <p>4. Compare and contrast metals, nonmetals, and metalloids.</p>
      </div>
    `,
    subjectId: 3, // Science
    grade: 9,
    duration: 45,
    difficulty: 4,
    downloadSize: 12000, // 12MB
    downloadUrl: "/lessons/science/atoms-elements"
  },
  
  // Grade 12
  {
    title: "Genetics: DNA Structure and Replication",
    description: "Explore the molecular structure of DNA and how it replicates for cell division.",
    content: `
      <h1>Genetics: DNA Structure and Replication</h1>
      <p>DNA (deoxyribonucleic acid) is the hereditary material that carries the genetic instructions for the development and functioning of all living organisms.</p>
      
      <h2>Discovery of DNA Structure</h2>
      <p>In 1953, James Watson and Francis Crick, building on the work of Rosalind Franklin and Maurice Wilkins, discovered the double helix structure of DNA, one of the most important scientific breakthroughs of the 20th century.</p>
      
      <h2>DNA Structure</h2>
      <div class="dna-diagram">
        [Interactive DNA structure diagram]
      </div>
      <p>DNA has a double helix structure that resembles a twisted ladder:</p>
      <ul>
        <li><b>Sugar-Phosphate Backbone:</b> Forms the "sides" of the ladder</li>
        <li><b>Nucleotide Bases:</b> Form the "rungs" of the ladder</li>
        <li><b>Hydrogen Bonds:</b> Connect complementary bases</li>
      </ul>
      
      <h2>Nucleotide Bases</h2>
      <p>DNA contains four types of nucleotide bases:</p>
      <ul>
        <li><b>Adenine (A):</b> Always pairs with Thymine (T)</li>
        <li><b>Thymine (T):</b> Always pairs with Adenine (A)</li>
        <li><b>Guanine (G):</b> Always pairs with Cytosine (C)</li>
        <li><b>Cytosine (C):</b> Always pairs with Guanine (G)</li>
      </ul>
      <p>This is known as complementary base pairing.</p>
      
      <h2>DNA Replication</h2>
      <p>Before a cell divides, it must duplicate its DNA in a process called replication:</p>
      <ol>
        <li><b>Unwinding:</b> The enzyme helicase unwinds and separates the DNA strands</li>
        <li><b>Complementary Base Pairing:</b> DNA polymerase adds complementary nucleotides to each strand (A to T, G to C)</li>
        <li><b>Proofreading:</b> DNA polymerase checks for and corrects most errors</li>
        <li><b>Completion:</b> Two identical DNA molecules are formed, each with one original strand and one new strand (semiconservative replication)</li>
      </ol>
      
      <h2>From DNA to Proteins</h2>
      <p>The sequence of bases in DNA forms a genetic code that determines the sequence of amino acids in proteins:</p>
      <ol>
        <li><b>Transcription:</b> DNA code is copied to messenger RNA (mRNA)</li>
        <li><b>Translation:</b> mRNA code is used to assemble amino acids into proteins</li>
      </ol>
      
      <h2>Mutations</h2>
      <p>Changes in the DNA sequence are called mutations and can be caused by:</p>
      <ul>
        <li>Errors during replication</li>
        <li>Exposure to radiation or chemicals</li>
        <li>Viruses</li>
      </ul>
      <p>Mutations may have no effect, be harmful, or occasionally beneficial.</p>
      
      <h2>DNA Applications</h2>
      <p>Understanding DNA has led to remarkable advances in:</p>
      <ul>
        <li>Genetic testing for diseases</li>
        <li>Forensic science and criminal investigations</li>
        <li>Ancestry and evolutionary studies</li>
        <li>Genetic engineering and gene therapy</li>
      </ul>
      
      <h2>Check Your Understanding</h2>
      <div class="interactive-questions">
        <p>1. Draw and label the structure of DNA.</p>
        <p>2. Explain complementary base pairing and why it's important.</p>
        <p>3. Describe the steps of DNA replication.</p>
        <p>4. What is semiconservative replication, and how was it proven?</p>
      </div>
    `,
    subjectId: 3, // Science
    grade: 12,
    duration: 50,
    difficulty: 5,
    downloadSize: 15000, // 15MB
    downloadUrl: "/lessons/science/dna-structure-replication"
  }
];

// QUIZZES
const quizzes = [
  // Math Grade 1: Counting to 100
  {
    title: "Counting to 100 Quiz",
    description: "Test your knowledge of counting numbers from 1 to 100.",
    lessonId: 1, // Will be updated after lessons are created
    questions: [
      {
        id: "m1q1",
        question: "What number comes after 19?",
        options: [
          { id: "m1q1a", text: "18" },
          { id: "m1q1b", text: "20" },
          { id: "m1q1c", text: "21" },
          { id: "m1q1d", text: "90" }
        ],
        correctOptionId: "m1q1b",
        explanation: "After 19 comes 20. We count: 18, 19, 20, 21..."
      },
      {
        id: "m1q2",
        question: "Fill in the missing numbers: 45, 46, ____, 48, ____",
        options: [
          { id: "m1q2a", text: "47, 49" },
          { id: "m1q2b", text: "47, 50" },
          { id: "m1q2c", text: "50, 51" },
          { id: "m1q2d", text: "44, 47" }
        ],
        correctOptionId: "m1q2a",
        explanation: "The missing numbers are 47 and 49. The sequence is: 45, 46, 47, 48, 49."
      },
      {
        id: "m1q3",
        question: "Which shows counting by tens?",
        options: [
          { id: "m1q3a", text: "5, 10, 15, 20" },
          { id: "m1q3b", text: "2, 4, 6, 8" },
          { id: "m1q3c", text: "10, 20, 30, 40" },
          { id: "m1q3d", text: "1, 10, 100, 1000" }
        ],
        correctOptionId: "m1q3c",
        explanation: "Counting by tens means adding 10 each time: 10, 20, 30, 40..."
      },
      {
        id: "m1q4",
        question: "What number is 1 more than 59?",
        options: [
          { id: "m1q4a", text: "58" },
          { id: "m1q4b", text: "60" },
          { id: "m1q4c", text: "69" },
          { id: "m1q4d", text: "50" }
        ],
        correctOptionId: "m1q4b",
        explanation: "1 more than 59 is 60. We count: 58, 59, 60, 61..."
      },
      {
        id: "m1q5",
        question: "Which number is between 75 and 77?",
        options: [
          { id: "m1q5a", text: "74" },
          { id: "m1q5b", text: "76" },
          { id: "m1q5c", text: "78" },
          { id: "m1q5d", text: "70" }
        ],
        correctOptionId: "m1q5b",
        explanation: "76 is between 75 and 77. The numbers in order are: 74, 75, 76, 77, 78."
      }
    ]
  },
  
  // Math Grade 3: Multiplication Tables
  {
    title: "Multiplication Tables Quiz",
    description: "Test your knowledge of multiplication facts from 1 to 10.",
    lessonId: 2, // Will be updated after lessons are created
    questions: [
      {
        id: "m3q1",
        question: "What is 7 × 8?",
        options: [
          { id: "m3q1a", text: "15" },
          { id: "m3q1b", text: "48" },
          { id: "m3q1c", text: "56" },
          { id: "m3q1d", text: "64" }
        ],
        correctOptionId: "m3q1c",
        explanation: "7 × 8 = 56. You can think of this as 7 groups of 8 or 8 groups of 7."
      },
      {
        id: "m3q2",
        question: "Which of these is equal to 6 × 4?",
        options: [
          { id: "m3q2a", text: "6 + 6 + 6 + 6" },
          { id: "m3q2b", text: "4 + 4 + 4 + 4 + 4 + 4" },
          { id: "m3q2c", text: "6 + 4" },
          { id: "m3q2d", text: "4 × 6" }
        ],
        correctOptionId: "m3q2b",
        explanation: "6 × 4 means 6 groups of 4, which is 4 + 4 + 4 + 4 + 4 + 4 = 24. Also, 4 × 6 = 24 because multiplication can be done in any order."
      },
      {
        id: "m3q3",
        question: "What is 9 × 3?",
        options: [
          { id: "m3q3a", text: "12" },
          { id: "m3q3b", text: "21" },
          { id: "m3q3c", text: "27" },
          { id: "m3q3d", text: "36" }
        ],
        correctOptionId: "m3q3c",
        explanation: "9 × 3 = 27. You can think of this as 9 groups of 3 or 3 groups of 9."
      },
      {
        id: "m3q4",
        question: "If 5 children each have 7 stickers, how many stickers are there altogether?",
        options: [
          { id: "m3q4a", text: "12 stickers" },
          { id: "m3q4b", text: "35 stickers" },
          { id: "m3q4c", text: "25 stickers" },
          { id: "m3q4d", text: "40 stickers" }
        ],
        correctOptionId: "m3q4b",
        explanation: "5 children × 7 stickers each = 35 stickers altogether."
      },
      {
        id: "m3q5",
        question: "Which multiplication fact equals 42?",
        options: [
          { id: "m3q5a", text: "6 × 8" },
          { id: "m3q5b", text: "7 × 5" },
          { id: "m3q5c", text: "6 × 7" },
          { id: "m3q5d", text: "8 × 4" }
        ],
        correctOptionId: "m3q5c",
        explanation: "6 × 7 = 42. The other products are: 6 × 8 = 48, 7 × 5 = 35, and 8 × 4 = 32."
      }
    ]
  },
  
  // Math Grade 5: Fractions and Decimals
  {
    title: "Fractions and Decimals Quiz",
    description: "Test your knowledge of converting between fractions and decimals.",
    lessonId: 3, // Will be updated after lessons are created
    questions: [
      {
        id: "m5q1",
        question: "What is 3/4 as a decimal?",
        options: [
          { id: "m5q1a", text: "0.25" },
          { id: "m5q1b", text: "0.34" },
          { id: "m5q1c", text: "0.75" },
          { id: "m5q1d", text: "0.43" }
        ],
        correctOptionId: "m5q1c",
        explanation: "3/4 = 0.75. To convert a fraction to a decimal, divide the numerator by the denominator: 3 ÷ 4 = 0.75."
      },
      {
        id: "m5q2",
        question: "Which fraction is equal to 0.2?",
        options: [
          { id: "m5q2a", text: "1/2" },
          { id: "m5q2b", text: "1/5" },
          { id: "m5q2c", text: "1/4" },
          { id: "m5q2d", text: "2/10" }
        ],
        correctOptionId: "m5q2b",
        explanation: "0.2 = 1/5. We can also write it as 2/10, which simplifies to 1/5."
      },
      {
        id: "m5q3",
        question: "What is 0.65 as a fraction in simplest form?",
        options: [
          { id: "m5q3a", text: "65/100" },
          { id: "m5q3b", text: "13/20" },
          { id: "m5q3c", text: "6.5/10" },
          { id: "m5q3d", text: "5/8" }
        ],
        correctOptionId: "m5q3b",
        explanation: "0.65 = 65/100, which simplifies to 13/20 by dividing both numbers by their greatest common factor, 5."
      },
      {
        id: "m5q4",
        question: "Calculate: 1/2 + 0.25",
        options: [
          { id: "m5q4a", text: "0.75" },
          { id: "m5q4b", text: "0.5" },
          { id: "m5q4c", text: "0.25" },
          { id: "m5q4d", text: "0.125" }
        ],
        correctOptionId: "m5q4a",
        explanation: "1/2 + 0.25 = 0.5 + 0.25 = 0.75. We convert 1/2 to 0.5, then add."
      },
      {
        id: "m5q5",
        question: "Which is greater: 3/5 or 0.55?",
        options: [
          { id: "m5q5a", text: "3/5" },
          { id: "m5q5b", text: "0.55" },
          { id: "m5q5c", text: "They are equal" },
          { id: "m5q5d", text: "Can't be determined" }
        ],
        correctOptionId: "m5q5a",
        explanation: "3/5 = 0.6, which is greater than 0.55. To compare, convert to the same format (either both fractions or both decimals)."
      }
    ]
  },
  
  // Math Grade 8: Linear Equations
  {
    title: "Linear Equations Quiz",
    description: "Test your skills in solving linear equations.",
    lessonId: 4, // Will be updated after lessons are created
    questions: [
      {
        id: "m8q1",
        question: "Solve for x: 3x + 7 = 22",
        options: [
          { id: "m8q1a", text: "x = 5" },
          { id: "m8q1b", text: "x = 8" },
          { id: "m8q1c", text: "x = 4" },
          { id: "m8q1d", text: "x = 9.67" }
        ],
        correctOptionId: "m8q1a",
        explanation: "3x + 7 = 22\n3x = 15 (subtract 7 from both sides)\nx = 5 (divide both sides by 3)"
      },
      {
        id: "m8q2",
        question: "Solve for y: 4y - 10 = 2y + 6",
        options: [
          { id: "m8q2a", text: "y = 4" },
          { id: "m8q2b", text: "y = 8" },
          { id: "m8q2c", text: "y = 16" },
          { id: "m8q2d", text: "y = -8" }
        ],
        correctOptionId: "m8q2b",
        explanation: "4y - 10 = 2y + 6\n4y - 2y = 6 + 10 (rearrange terms)\n2y = 16\ny = 8"
      },
      {
        id: "m8q3",
        question: "If 2(x + 3) = 14, what is the value of x?",
        options: [
          { id: "m8q3a", text: "x = 4" },
          { id: "m8q3b", text: "x = 7" },
          { id: "m8q3c", text: "x = 5.5" },
          { id: "m8q3d", text: "x = -1" }
        ],
        correctOptionId: "m8q3a",
        explanation: "2(x + 3) = 14\nx + 3 = 7 (divide both sides by 2)\nx = 4 (subtract 3 from both sides)"
      },
      {
        id: "m8q4",
        question: "Solve for z: z/5 + 3 = 7",
        options: [
          { id: "m8q4a", text: "z = 20" },
          { id: "m8q4b", text: "z = 35" },
          { id: "m8q4c", text: "z = 10" },
          { id: "m8q4d", text: "z = 25" }
        ],
        correctOptionId: "m8q4a",
        explanation: "z/5 + 3 = 7\nz/5 = 4 (subtract 3 from both sides)\nz = 20 (multiply both sides by 5)"
      },
      {
        id: "m8q5",
        question: "Which equation is equivalent to 3(x - 2) = 15?",
        options: [
          { id: "m8q5a", text: "3x - 6 = 15" },
          { id: "m8q5b", text: "3x - 2 = 15" },
          { id: "m8q5c", text: "3x + 6 = 15" },
          { id: "m8q5d", text: "x - 2 = 5" }
        ],
        correctOptionId: "m8q5a",
        explanation: "3(x - 2) = 15 expands to 3x - 6 = 15 by distributing the 3."
      }
    ]
  },
  
  // Math Grade 11: Calculus Limits
  {
    title: "Calculus Limits Quiz",
    description: "Test your understanding of limits in calculus.",
    lessonId: 5, // Will be updated after lessons are created
    questions: [
      {
        id: "m11q1",
        question: "Evaluate: lim(x→2) (x² + 3x)",
        options: [
          { id: "m11q1a", text: "4" },
          { id: "m11q1b", text: "10" },
          { id: "m11q1c", text: "14" },
          { id: "m11q1d", text: "7" }
        ],
        correctOptionId: "m11q1b",
        explanation: "lim(x→2) (x² + 3x) = 2² + 3(2) = 4 + 6 = 10. This is a direct substitution since the function is continuous at x = 2."
      },
      {
        id: "m11q2",
        question: "Find lim(x→0) (sin x)/x",
        options: [
          { id: "m11q2a", text: "0" },
          { id: "m11q2b", text: "1" },
          { id: "m11q2c", text: "Does not exist" },
          { id: "m11q2d", text: "∞" }
        ],
        correctOptionId: "m11q2b",
        explanation: "lim(x→0) (sin x)/x = 1. This is a fundamental limit in calculus. It cannot be evaluated by direct substitution (which would give 0/0), but can be proven using geometric methods or L'Hôpital's rule."
      },
      {
        id: "m11q3",
        question: "Evaluate: lim(x→4) (x-4)/(√x-2)",
        options: [
          { id: "m11q3a", text: "0" },
          { id: "m11q3b", text: "Does not exist" },
          { id: "m11q3c", text: "4" },
          { id: "m11q3d", text: "2" }
        ],
        correctOptionId: "m11q3c",
        explanation: "Direct substitution gives 0/0, which is indeterminate. We can factor and simplify:\nlim(x→4) (x-4)/(√x-2) = lim(x→4) [(x-4)/((√x-2)(√x+2))] = lim(x→4) [(x-4)/((√x)²-4)] = lim(x→4) [(x-4)/(x-4)] = 4"
      },
      {
        id: "m11q4",
        question: "What is lim(x→∞) (3x²+2x)/(x²+1)?",
        options: [
          { id: "m11q4a", text: "0" },
          { id: "m11q4b", text: "1" },
          { id: "m11q4c", text: "3" },
          { id: "m11q4d", text: "∞" }
        ],
        correctOptionId: "m11q4c",
        explanation: "To find a limit as x approaches infinity, divide both numerator and denominator by the highest power of x (in this case, x²):\nlim(x→∞) (3x²+2x)/(x²+1) = lim(x→∞) (3+2/x)/(1+1/x²) = 3/1 = 3"
      },
      {
        id: "m11q5",
        question: "Evaluate: lim(h→0) [(3+h)²-9]/h",
        options: [
          { id: "m11q5a", text: "3" },
          { id: "m11q5b", text: "6" },
          { id: "m11q5c", text: "9" },
          { id: "m11q5d", text: "Does not exist" }
        ],
        correctOptionId: "m11q5b",
        explanation: "lim(h→0) [(3+h)²-9]/h = lim(h→0) [9+6h+h²-9]/h = lim(h→0) [6h+h²]/h = lim(h→0) [6+h] = 6. Note that this limit represents the derivative of f(x)=x² at x=3."
      }
    ]
  },
  
  // English Grade 2: Reading Comprehension
  {
    title: "Reading Comprehension Quiz",
    description: "Test your understanding of story elements through short stories.",
    lessonId: 6, // Will be updated after lessons are created
    questions: [
      {
        id: "e2q1",
        question: "Who are the main characters in 'The Lost Puppy' story?",
        options: [
          { id: "e2q1a", text: "Max and Lily" },
          { id: "e2q1b", text: "Lily and her mom" },
          { id: "e2q1c", text: "Max and the neighbor" },
          { id: "e2q1d", text: "The neighbor and Lily" }
        ],
        correctOptionId: "e2q1a",
        explanation: "The main characters in the story are Max (the puppy) and Lily (Max's owner)."
      },
      {
        id: "e2q2",
        question: "Where did Max live?",
        options: [
          { id: "e2q2a", text: "In a pet store" },
          { id: "e2q2b", text: "In a red house with a small yard" },
          { id: "e2q2c", text: "In a blue house with a big yard" },
          { id: "e2q2d", text: "At the neighbor's house" }
        ],
        correctOptionId: "e2q2c",
        explanation: "According to the story, Max lived with Lily 'in a blue house with a big yard.'"
      },
      {
        id: "e2q3",
        question: "How did Max get out of the yard?",
        options: [
          { id: "e2q3a", text: "Lily let him out" },
          { id: "e2q3b", text: "He jumped over the fence" },
          { id: "e2q3c", text: "He dug a hole under the fence" },
          { id: "e2q3d", text: "The gate was left open" }
        ],
        correctOptionId: "e2q3c",
        explanation: "The story says, 'One day, Max dug a hole under the fence and got out.'"
      },
      {
        id: "e2q4",
        question: "How did Lily find Max?",
        options: [
          { id: "e2q4a", text: "She found him in the street" },
          { id: "e2q4b", text: "The neighbor called her after finding Max" },
          { id: "e2q4c", text: "Max found his way home" },
          { id: "e2q4d", text: "She put up posters around town" }
        ],
        correctOptionId: "e2q4b",
        explanation: "The story states that 'A kind neighbor found Max and read his tag. The neighbor called Lily, who came right away.'"
      },
      {
        id: "e2q5",
        question: "What did Max learn from his adventure?",
        options: [
          { id: "e2q5a", text: "To make friends with neighbors" },
          { id: "e2q5b", text: "To wear his tag at all times" },
          { id: "e2q5c", text: "That staying in his yard was the safest place to be" },
          { id: "e2q5d", text: "How to find his way home" }
        ],
        correctOptionId: "e2q5c",
        explanation: "The last line of the story says, 'Max learned that staying in his yard was the safest place to be.'"
      }
    ]
  },
  
  // English Grade 4: Parts of Speech
  {
    title: "Parts of Speech Quiz",
    description: "Test your knowledge of nouns, verbs, adjectives, and adverbs.",
    lessonId: 7, // Will be updated after lessons are created
    questions: [
      {
        id: "e4q1",
        question: "Which word is a noun in this sentence? 'The small dog barked loudly at the mailman.'",
        options: [
          { id: "e4q1a", text: "small" },
          { id: "e4q1b", text: "barked" },
          { id: "e4q1c", text: "loudly" },
          { id: "e4q1d", text: "mailman" }
        ],
        correctOptionId: "e4q1d",
        explanation: "'Mailman' is a noun because it names a person. 'Dog' is also a noun in this sentence."
      },
      {
        id: "e4q2",
        question: "Identify the verb in this sentence: 'She quickly writes her homework every evening.'",
        options: [
          { id: "e4q2a", text: "She" },
          { id: "e4q2b", text: "quickly" },
          { id: "e4q2c", text: "writes" },
          { id: "e4q2d", text: "homework" }
        ],
        correctOptionId: "e4q2c",
        explanation: "'Writes' is a verb because it shows action."
      },
      {
        id: "e4q3",
        question: "Which word is an adjective in this sentence? 'The happy children played with their new toys.'",
        options: [
          { id: "e4q3a", text: "happy" },
          { id: "e4q3b", text: "children" },
          { id: "e4q3c", text: "played" },
          { id: "e4q3d", text: "their" }
        ],
        correctOptionId: "e4q3a",
        explanation: "'Happy' is an adjective because it describes the noun 'children'. 'New' is also an adjective in this sentence."
      },
      {
        id: "e4q4",
        question: "Identify the adverb in this sentence: 'The cat jumped quickly onto the table.'",
        options: [
          { id: "e4q4a", text: "cat" },
          { id: "e4q4b", text: "jumped" },
          { id: "e4q4c", text: "quickly" },
          { id: "e4q4d", text: "table" }
        ],
        correctOptionId: "e4q4c",
        explanation: "'Quickly' is an adverb because it describes how the cat jumped (the verb)."
      },
      {
        id: "e4q5",
        question: "In the sentence 'The very tall basketball player scored easily', which two words are adjectives?",
        options: [
          { id: "e4q5a", text: "very, tall" },
          { id: "e4q5b", text: "tall, basketball" },
          { id: "e4q5c", text: "basketball, player" },
          { id: "e4q5d", text: "player, easily" }
        ],
        correctOptionId: "e4q5b",
        explanation: "'Tall' and 'basketball' are adjectives because they describe the noun 'player'. 'Very' is an adverb that describes the adjective 'tall'."
      }
    ]
  },
  
  // English Grade 7: Five-Paragraph Essay
  {
    title: "Five-Paragraph Essay Quiz",
    description: "Test your knowledge of essay structure and writing techniques.",
    lessonId: 8, // Will be updated after lessons are created
    questions: [
      {
        id: "e7q1",
        question: "What typically appears in the introduction of a five-paragraph essay?",
        options: [
          { id: "e7q1a", text: "A conclusion statement" },
          { id: "e7q1b", text: "Detailed evidence for all arguments" },
          { id: "e7q1c", text: "A thesis statement" },
          { id: "e7q1d", text: "A quotation from a research source" }
        ],
        correctOptionId: "e7q1c",
        explanation: "A thesis statement typically appears in the introduction of an essay. It states the main argument or point that will be developed throughout the essay."
      },
      {
        id: "e7q2",
        question: "What is the purpose of body paragraphs in a five-paragraph essay?",
        options: [
          { id: "e7q2a", text: "To introduce new, unrelated topics" },
          { id: "e7q2b", text: "To provide supporting evidence for the thesis" },
          { id: "e7q2c", text: "To summarize the essay" },
          { id: "e7q2d", text: "To create an emotional connection with readers" }
        ],
        correctOptionId: "e7q2b",
        explanation: "Body paragraphs provide supporting evidence, examples, and explanation that support the thesis statement."
      },
      {
        id: "e7q3",
        question: "Which statement best describes a topic sentence?",
        options: [
          { id: "e7q3a", text: "It always appears at the end of a paragraph" },
          { id: "e7q3b", text: "It explains the main idea of a body paragraph" },
          { id: "e7q3c", text: "It provides a quotation from a source" },
          { id: "e7q3d", text: "It summarizes the entire essay" }
        ],
        correctOptionId: "e7q3b",
        explanation: "A topic sentence explains the main idea of a body paragraph and usually appears at the beginning of the paragraph."
      },
      {
        id: "e7q4",
        question: "What should be included in the conclusion of a five-paragraph essay?",
        options: [
          { id: "e7q4a", text: "New arguments not previously mentioned" },
          { id: "e7q4b", text: "The thesis statement word-for-word" },
          { id: "e7q4c", text: "A restatement of the thesis and summary of main points" },
          { id: "e7q4d", text: "Detailed evidence for each argument" }
        ],
        correctOptionId: "e7q4c",
        explanation: "The conclusion should restate the thesis (in different words) and summarize the main points of the essay. It may also include a final thought or call to action."
      },
      {
        id: "e7q5",
        question: "Which is NOT a characteristic of an effective five-paragraph essay?",
        options: [
          { id: "e7q5a", text: "Clear transitions between paragraphs" },
          { id: "e7q5b", text: "Well-developed supporting points with evidence" },
          { id: "e7q5c", text: "Introduction of new arguments in the conclusion" },
          { id: "e7q5d", text: "A clear thesis statement that guides the essay" }
        ],
        correctOptionId: "e7q5c",
        explanation: "Introducing new arguments in the conclusion is NOT a characteristic of an effective essay. New arguments should be presented in body paragraphs with appropriate evidence and explanation."
      }
    ]
  },
  
  // English Grade 10: Themes in Literature
  {
    title: "Literary Themes Quiz",
    description: "Test your understanding of themes and their analysis in literature.",
    lessonId: 9, // Will be updated after lessons are created
    questions: [
      {
        id: "e10q1",
        question: "What is a theme in literature?",
        options: [
          { id: "e10q1a", text: "The main character in a story" },
          { id: "e10q1b", text: "The setting where the story takes place" },
          { id: "e10q1c", text: "A central message or insight about life" },
          { id: "e10q1d", text: "The series of events that make up the plot" }
        ],
        correctOptionId: "e10q1c",
        explanation: "A theme is a central message, insight, or idea about life that the author wants to convey through the story."
      },
      {
        id: "e10q2",
        question: "What is the difference between a theme and a motif?",
        options: [
          { id: "e10q2a", text: "A theme is explicit while a motif is implicit" },
          { id: "e10q2b", text: "A theme is a recurring element, while a motif is the central message" },
          { id: "e10q2c", text: "A motif is a recurring element that supports a theme" },
          { id: "e10q2d", text: "There is no difference; the terms are interchangeable" }
        ],
        correctOptionId: "e10q2c",
        explanation: "A motif is a recurring element (image, symbol, phrase) that helps develop and support a theme, which is the broader message or insight."
      },
      {
        id: "e10q3",
        question: "Which of the following is an example of a theme?",
        options: [
          { id: "e10q3a", text: "The repeated appearance of mirrors in a novel" },
          { id: "e10q3b", text: "The struggle between individual freedom and societal expectations" },
          { id: "e10q3c", text: "A character named Jane who is the protagonist" },
          { id: "e10q3d", text: "A story set during the American Civil War" }
        ],
        correctOptionId: "e10q3b",
        explanation: "'The struggle between individual freedom and societal expectations' is a theme because it's a central message about life. The repeated appearance of mirrors would be a motif."
      },
      {
        id: "e10q4",
        question: "How do authors develop themes in their work?",
        options: [
          { id: "e10q4a", text: "Only through direct statements about the theme" },
          { id: "e10q4b", text: "Through character development, conflict, symbolism, and dialogue" },
          { id: "e10q4c", text: "Only through the setting of the story" },
          { id: "e10q4d", text: "By explaining the theme in the title" }
        ],
        correctOptionId: "e10q4b",
        explanation: "Authors develop themes through multiple elements including character development, conflict resolution, symbolism, dialogue, and plot events."
      },
      {
        id: "e10q5",
        question: "Which question would be most helpful when identifying themes in a literary work?",
        options: [
          { id: "e10q5a", text: "Who is the main character?" },
          { id: "e10q5b", text: "When and where does the story take place?" },
          { id: "e10q5c", text: "What lessons do the characters learn?" },
          { id: "e10q5d", text: "How many chapters are in the book?" }
        ],
        correctOptionId: "e10q5c",
        explanation: "Asking about lessons learned by characters helps identify themes because themes often relate to insights or truths about human experience that are revealed through character growth."
      }
    ]
  },
  
  // English Grade 12: Rhetoric
  {
    title: "Rhetoric and Persuasive Techniques Quiz",
    description: "Test your knowledge of rhetorical devices and persuasive writing strategies.",
    lessonId: 10, // Will be updated after lessons are created
    questions: [
      {
        id: "e12q1",
        question: "What are the three appeals in the rhetorical triangle?",
        options: [
          { id: "e12q1a", text: "Logos, pathos, ethos" },
          { id: "e12q1b", text: "Introduction, body, conclusion" },
          { id: "e12q1c", text: "Speaker, message, audience" },
          { id: "e12q1d", text: "Assertion, evidence, analysis" }
        ],
        correctOptionId: "e12q1a",
        explanation: "The rhetorical triangle consists of logos (logic), pathos (emotion), and ethos (credibility/ethics), which are the three primary appeals used in persuasion."
      },
      {
        id: "e12q2",
        question: "Identify the rhetorical device: 'Ask not what your country can do for you, ask what you can do for your country.'",
        options: [
          { id: "e12q2a", text: "Hyperbole" },
          { id: "e12q2b", text: "Antithesis" },
          { id: "e12q2c", text: "Alliteration" },
          { id: "e12q2d", text: "Rhetorical question" }
        ],
        correctOptionId: "e12q2b",
        explanation: "This is antithesis, which presents contrasting ideas in a parallel structure. The quote contrasts 'what your country can do for you' with 'what you can do for your country.'"
      },
      {
        id: "e12q3",
        question: "Which of the following is an example of an appeal to pathos?",
        options: [
          { id: "e12q3a", text: "According to a recent scientific study..." },
          { id: "e12q3b", text: "As someone with 20 years of experience in this field..." },
          { id: "e12q3c", text: "Imagine the fear these children feel every night without a home..." },
          { id: "e12q3d", text: "The logical conclusion of this policy would be..." }
        ],
        correctOptionId: "e12q3c",
        explanation: "'Imagine the fear these children feel...' is an appeal to pathos because it attempts to evoke emotional responses (empathy, compassion) from the audience."
      },
      {
        id: "e12q4",
        question: "What is anaphora?",
        options: [
          { id: "e12q4a", text: "Exaggeration for effect" },
          { id: "e12q4b", text: "Repetition at the beginning of successive clauses" },
          { id: "e12q4c", text: "A comparison using 'like' or 'as'" },
          { id: "e12q4d", text: "A question asked for effect, not expecting an answer" }
        ],
        correctOptionId: "e12q4b",
        explanation: "Anaphora is the repetition of a word or phrase at the beginning of successive clauses, such as 'I have a dream' repeated throughout Martin Luther King Jr.'s famous speech."
      },
      {
        id: "e12q5",
        question: "In which context would an appeal to logos be most effective?",
        options: [
          { id: "e12q5a", text: "A memorial service speech" },
          { id: "e12q5b", text: "A campaign rally" },
          { id: "e12q5c", text: "A scientific presentation" },
          { id: "e12q5d", text: "A motivational speech for athletes" }
        ],
        correctOptionId: "e12q5c",
        explanation: "An appeal to logos (logic) would be most effective in a scientific presentation, where evidence, reasoning, and factual information are highly valued."
      }
    ]
  },
  
  // Science Grade 1: Five Senses
  {
    title: "The Five Senses Quiz",
    description: "Test your knowledge of how we use our five senses to explore the world.",
    lessonId: 11, // Will be updated after lessons are created
    questions: [
      {
        id: "s1q1",
        question: "Which body part do we use for the sense of hearing?",
        options: [
          { id: "s1q1a", text: "Eyes" },
          { id: "s1q1b", text: "Nose" },
          { id: "s1q1c", text: "Ears" },
          { id: "s1q1d", text: "Tongue" }
        ],
        correctOptionId: "s1q1c",
        explanation: "We use our ears for the sense of hearing. Our ears detect sound waves in the air."
      },
      {
        id: "s1q2",
        question: "Which sense would you use to tell if an apple is sweet?",
        options: [
          { id: "s1q2a", text: "Sight" },
          { id: "s1q2b", text: "Smell" },
          { id: "s1q2c", text: "Touch" },
          { id: "s1q2d", text: "Taste" }
        ],
        correctOptionId: "s1q2d",
        explanation: "We use our sense of taste to determine if something is sweet, sour, salty, or bitter. Our tongue has special taste buds for detecting these flavors."
      },
      {
        id: "s1q3",
        question: "Which sense helps you know if something is hot or cold?",
        options: [
          { id: "s1q3a", text: "Smell" },
          { id: "s1q3b", text: "Sight" },
          { id: "s1q3c", text: "Touch" },
          { id: "s1q3d", text: "Taste" }
        ],
        correctOptionId: "s1q3c",
        explanation: "We use our sense of touch to feel temperature and tell if something is hot or cold. Our skin has special receptors that detect temperature."
      },
      {
        id: "s1q4",
        question: "If you wanted to know the color of a flower, which sense would you use?",
        options: [
          { id: "s1q4a", text: "Sight" },
          { id: "s1q4b", text: "Hearing" },
          { id: "s1q4c", text: "Smell" },
          { id: "s1q4d", text: "Touch" }
        ],
        correctOptionId: "s1q4a",
        explanation: "We use our sense of sight to see colors. Our eyes detect light and color."
      },
      {
        id: "s1q5",
        question: "Which sense would help you know if cookies are baking in the oven without seeing them?",
        options: [
          { id: "s1q5a", text: "Touch" },
          { id: "s1q5b", text: "Hearing" },
          { id: "s1q5c", text: "Smell" },
          { id: "s1q5d", text: "Taste" }
        ],
        correctOptionId: "s1q5c",
        explanation: "We use our sense of smell to detect odors in the air, like the sweet smell of cookies baking. Our nose has special receptors for detecting smells."
      }
    ]
  },
  
  // Science Grade 4: Water Cycle
  {
    title: "The Water Cycle Quiz",
    description: "Test your knowledge of the water cycle and how water moves through our environment.",
    lessonId: 12, // Will be updated after lessons are created
    questions: [
      {
        id: "s4q1",
        question: "What process turns liquid water into water vapor?",
        options: [
          { id: "s4q1a", text: "Condensation" },
          { id: "s4q1b", text: "Precipitation" },
          { id: "s4q1c", text: "Evaporation" },
          { id: "s4q1d", text: "Collection" }
        ],
        correctOptionId: "s4q1c",
        explanation: "Evaporation is the process that turns liquid water into water vapor (gas). This happens when the sun heats water in oceans, lakes, and rivers."
      },
      {
        id: "s4q2",
        question: "What provides the energy for evaporation in the water cycle?",
        options: [
          { id: "s4q2a", text: "Wind" },
          { id: "s4q2b", text: "The sun" },
          { id: "s4q2c", text: "Plants" },
          { id: "s4q2d", text: "The ocean" }
        ],
        correctOptionId: "s4q2b",
        explanation: "The sun provides the energy for evaporation. The sun's heat causes water molecules to move faster until they escape as water vapor."
      },
      {
        id: "s4q3",
        question: "What is condensation in the water cycle?",
        options: [
          { id: "s4q3a", text: "When water falls from clouds as rain" },
          { id: "s4q3b", text: "When water vapor cools and forms clouds" },
          { id: "s4q3c", text: "When water flows back to the ocean" },
          { id: "s4q3d", text: "When plants release water vapor" }
        ],
        correctOptionId: "s4q3b",
        explanation: "Condensation is when water vapor cools and changes back into liquid water, forming clouds. It's similar to what happens when water droplets form on a cold glass."
      },
      {
        id: "s4q4",
        question: "Which of these is NOT a form of precipitation?",
        options: [
          { id: "s4q4a", text: "Rain" },
          { id: "s4q4b", text: "Snow" },
          { id: "s4q4c", text: "Fog" },
          { id: "s4q4d", text: "Hail" }
        ],
        correctOptionId: "s4q4c",
        explanation: "Fog is not a form of precipitation. Fog is a cloud that forms near the ground. Precipitation includes rain, snow, sleet, and hail, which all fall from clouds to the Earth's surface."
      },
      {
        id: "s4q5",
        question: "What is the correct order of the main water cycle processes?",
        options: [
          { id: "s4q5a", text: "Evaporation → Precipitation → Condensation → Collection" },
          { id: "s4q5b", text: "Condensation → Evaporation → Collection → Precipitation" },
          { id: "s4q5c", text: "Evaporation → Condensation → Precipitation → Collection" },
          { id: "s4q5d", text: "Precipitation → Evaporation → Condensation → Collection" }
        ],
        correctOptionId: "s4q5c",
        explanation: "The correct order is: Evaporation (water turns to vapor) → Condensation (vapor forms clouds) → Precipitation (water falls as rain/snow) → Collection (water returns to oceans/lakes/groundwater)."
      }
    ]
  },
  
  // Science Grade 6: Cells
  {
    title: "Cells: The Building Blocks of Life Quiz",
    description: "Test your knowledge of cell structures and functions.",
    lessonId: 13, // Will be updated after lessons are created
    questions: [
      {
        id: "s6q1",
        question: "What is the control center of the cell that contains DNA?",
        options: [
          { id: "s6q1a", text: "Cell membrane" },
          { id: "s6q1b", text: "Cytoplasm" },
          { id: "s6q1c", text: "Nucleus" },
          { id: "s6q1d", text: "Mitochondria" }
        ],
        correctOptionId: "s6q1c",
        explanation: "The nucleus is the control center of the cell and contains DNA, which carries genetic information."
      },
      {
        id: "s6q2",
        question: "Which organelle is known as the 'powerhouse of the cell' because it produces energy?",
        options: [
          { id: "s6q2a", text: "Lysosome" },
          { id: "s6q2b", text: "Ribosome" },
          { id: "s6q2c", text: "Mitochondria" },
          { id: "s6q2d", text: "Golgi apparatus" }
        ],
        correctOptionId: "s6q2c",
        explanation: "Mitochondria are known as the 'powerhouse of the cell' because they convert nutrients into energy (ATP) that the cell can use."
      },
      {
        id: "s6q3",
        question: "Which structure is found in plant cells but NOT in animal cells?",
        options: [
          { id: "s6q3a", text: "Cell membrane" },
          { id: "s6q3b", text: "Chloroplast" },
          { id: "s6q3c", text: "Nucleus" },
          { id: "s6q3d", text: "Mitochondria" }
        ],
        correctOptionId: "s6q3b",
        explanation: "Chloroplasts are found only in plant cells and some algae. They contain chlorophyll and are responsible for photosynthesis, which converts sunlight into food energy."
      },
      {
        id: "s6q4",
        question: "What is the function of the cell membrane?",
        options: [
          { id: "s6q4a", text: "To produce energy for the cell" },
          { id: "s6q4b", text: "To control what enters and leaves the cell" },
          { id: "s6q4c", text: "To store genetic information" },
          { id: "s6q4d", text: "To break down waste materials" }
        ],
        correctOptionId: "s6q4b",
        explanation: "The cell membrane controls what enters and leaves the cell, serving as a selective barrier that maintains the cell's internal environment."
      },
      {
        id: "s6q5",
        question: "Which type of cell has a nucleus and other membrane-bound organelles?",
        options: [
          { id: "s6q5a", text: "Prokaryotic cell" },
          { id: "s6q5b", text: "Eukaryotic cell" },
          { id: "s6q5c", text: "Both prokaryotic and eukaryotic cells" },
          { id: "s6q5d", text: "Neither prokaryotic nor eukaryotic cells" }
        ],
        correctOptionId: "s6q5b",
        explanation: "Eukaryotic cells have a nucleus and other membrane-bound organelles. Plant and animal cells are eukaryotic. Prokaryotic cells (like bacteria) do not have a nucleus or membrane-bound organelles."
      }
    ]
  },
  
  // Science Grade 9: Atoms and Elements
  {
    title: "Atoms and Elements Quiz",
    description: "Test your knowledge of the basic building blocks of matter.",
    lessonId: 14, // Will be updated after lessons are created
    questions: [
      {
        id: "s9q1",
        question: "What determines which element an atom represents?",
        options: [
          { id: "s9q1a", text: "The number of neutrons" },
          { id: "s9q1b", text: "The number of protons" },
          { id: "s9q1c", text: "The number of electrons" },
          { id: "s9q1d", text: "The total number of particles" }
        ],
        correctOptionId: "s9q1b",
        explanation: "The number of protons (atomic number) determines which element an atom represents. All atoms of the same element have the same number of protons."
      },
      {
        id: "s9q2",
        question: "Where are electrons located in an atom?",
        options: [
          { id: "s9q2a", text: "In the nucleus" },
          { id: "s9q2b", text: "Floating freely throughout the atom" },
          { id: "s9q2c", text: "In shells or energy levels surrounding the nucleus" },
          { id: "s9q2d", text: "Attached to protons" }
        ],
        correctOptionId: "s9q2c",
        explanation: "Electrons orbit the nucleus in shells or energy levels. These shells are regions where electrons are most likely to be found."
      },
      {
        id: "s9q3",
        question: "What is an isotope?",
        options: [
          { id: "s9q3a", text: "An atom with no neutrons" },
          { id: "s9q3b", text: "A molecule composed of two elements" },
          { id: "s9q3c", text: "An atom with a different number of neutrons than other atoms of the same element" },
          { id: "s9q3d", text: "An element that is always radioactive" }
        ],
        correctOptionId: "s9q3c",
        explanation: "Isotopes are atoms of the same element (same number of protons) that have different numbers of neutrons, resulting in different mass numbers."
      },
      {
        id: "s9q4",
        question: "Which of these is a characteristic of metals on the periodic table?",
        options: [
          { id: "s9q4a", text: "Poor conductors of heat and electricity" },
          { id: "s9q4b", text: "Typically gases at room temperature" },
          { id: "s9q4c", text: "Good conductors of heat and electricity" },
          { id: "s9q4d", text: "Brittle and dull in appearance" }
        ],
        correctOptionId: "s9q4c",
        explanation: "Metals are good conductors of heat and electricity. They are also typically shiny, malleable (can be hammered into sheets), and ductile (can be drawn into wires)."
      },
      {
        id: "s9q5",
        question: "What does the atomic mass (mass number) of an atom represent?",
        options: [
          { id: "s9q5a", text: "The number of protons only" },
          { id: "s9q5b", text: "The number of protons plus the number of neutrons" },
          { id: "s9q5c", text: "The number of protons plus the number of electrons" },
          { id: "s9q5d", text: "The total number of all particles in an atom" }
        ],
        correctOptionId: "s9q5b",
        explanation: "The atomic mass (mass number) represents the number of protons plus the number of neutrons in an atom. Electrons contribute negligible mass."
      }
    ]
  },
  
  // Science Grade 12: DNA Structure
  {
    title: "DNA Structure and Replication Quiz",
    description: "Test your knowledge of DNA's molecular structure and replication process.",
    lessonId: 15, // Will be updated after lessons are created
    questions: [
      {
        id: "s12q1",
        question: "Which scientists are credited with discovering the double helix structure of DNA in 1953?",
        options: [
          { id: "s12q1a", text: "Gregor Mendel and Charles Darwin" },
          { id: "s12q1b", text: "Louis Pasteur and Robert Koch" },
          { id: "s12q1c", text: "James Watson and Francis Crick" },
          { id: "s12q1d", text: "Marie Curie and Albert Einstein" }
        ],
        correctOptionId: "s12q1c",
        explanation: "James Watson and Francis Crick discovered the double helix structure of DNA in 1953, building on the X-ray crystallography work of Rosalind Franklin and Maurice Wilkins."
      },
      {
        id: "s12q2",
        question: "Which nucleotide base pairs with adenine (A) in DNA?",
        options: [
          { id: "s12q2a", text: "Guanine (G)" },
          { id: "s12q2b", text: "Cytosine (C)" },
          { id: "s12q2c", text: "Thymine (T)" },
          { id: "s12q2d", text: "Adenine (A)" }
        ],
        correctOptionId: "s12q2c",
        explanation: "Thymine (T) pairs with adenine (A) in DNA. The other base pairing is guanine (G) with cytosine (C). These specific pairings are crucial for DNA structure and replication."
      },
      {
        id: "s12q3",
        question: "What type of bond connects complementary bases in DNA?",
        options: [
          { id: "s12q3a", text: "Covalent bond" },
          { id: "s12q3b", text: "Ionic bond" },
          { id: "s12q3c", text: "Hydrogen bond" },
          { id: "s12q3d", text: "Peptide bond" }
        ],
        correctOptionId: "s12q3c",
        explanation: "Hydrogen bonds connect complementary bases in DNA. These are relatively weak bonds that can be broken during DNA replication and transcription, but are strong enough in combination to maintain DNA's structure."
      },
      {
        id: "s12q4",
        question: "Which enzyme is responsible for unwinding the DNA double helix during replication?",
        options: [
          { id: "s12q4a", text: "DNA polymerase" },
          { id: "s12q4b", text: "Helicase" },
          { id: "s12q4c", text: "Ligase" },
          { id: "s12q4d", text: "RNA primase" }
        ],
        correctOptionId: "s12q4b",
        explanation: "Helicase is the enzyme that unwinds and separates the DNA double helix during replication by breaking the hydrogen bonds between base pairs."
      },
      {
        id: "s12q5",
        question: "DNA replication is described as semiconservative. What does this mean?",
        options: [
          { id: "s12q5a", text: "Only half of the DNA molecule is copied" },
          { id: "s12q5b", text: "Each new DNA molecule contains one original strand and one new strand" },
          { id: "s12q5c", text: "The process uses half the energy of other cellular processes" },
          { id: "s12q5d", text: "Only conservative mutations are allowed during replication" }
        ],
        correctOptionId: "s12q5b",
        explanation: "Semiconservative replication means that each new DNA molecule contains one original strand from the parent molecule and one newly synthesized strand. This was demonstrated by the Meselson-Stahl experiment."
      }
    ]
  }
];

// Add all lessons and quizzes to an array
const allLessons = [
  ...mathLessons,
  ...englishLessons,
  ...scienceLessons
];

// Export for use with database setup
export {
  mathLessons,
  englishLessons,
  scienceLessons,
  allLessons,
  quizzes
};