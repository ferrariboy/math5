/* Lesson content. Module data plus the BC strand map. */
window.MATH_MODULES = [

          /* ---------------- MODULE 1 ---------------- */
          {
            id: 1,
            title: `Mega Numbers and Numerical Spaces`,
            book: `Singapore Math 5A, Whole Numbers`,
            bc: `Read, write and compare whole numbers to millions. Use place value to round and to multiply by 10 and 100.`,
            kidSummary: `Learn how huge numbers are built from garages that fit inside each other.`,
            bigIdea: {
              title: `The Nesting Garages`,
              hook: `Big numbers feel scary until you see how they are built. Every big number is a set of garages that nest inside each other, like a set of stacking dolls.`,
              steps: [
                {
                  stage: `Concrete`,
                  heading: `Fill a garage, build a bigger one`,
                  story: `Picture a tiny town where every toy car needs a parking spot. When ten toy cars are parked, the spots are full. So the town builds a Tens Garage that holds all ten cars at once. When ten Tens Garages are full, the town builds a Hundreds Garage to hold them. Ten Hundreds Garages fill a Thousands Garage. The town keeps going: a Ten Thousands Garage, a Hundred Thousands Garage, and finally the giant Millions Garage. Every new garage holds exactly ten of the garage before it. That is why our number system is called base ten.`,
                  plain: `A place value is just a garage size. The digit tells you how many garages of that size are full. A zero means that garage size is empty.`,
                  visual: {
                    type: `pre`,
                    text: [
                      `One car          o`,
                      `Tens Garage      [oooooooooo]`,
                      `Hundreds Garage  [10 Tens Garages]`,
                      `Thousands Garage [10 Hundreds Garages]`,
                      `...and so on up to the Millions Garage`
                    ].join('\n')
                  }
                },
                {
                  stage: `Pictorial`,
                  heading: `Draw the garages as a chart`,
                  story: `Now draw the town as a chart. Each column is one garage size. Look at 7,342,005. The 7 sits under Millions, so seven Millions Garages are full. The 3 is three Hundred Thousands Garages. The 4 is four Ten Thousands Garages. The 2 is two Thousands Garages. The two zeros under H and T mean the Hundreds and Tens garages are empty. The 5 is five loose cars in the Ones spot.`,
                  plain: `Read the chart from left to right. Say the number of full garages, then say the garage name. Skip any garage that is empty.`,
                  visual: {
                    type: `table`,
                    caption: `The number 7,342,005 in the garage chart`,
                    headers: [`Millions`, `H Thous`, `T Thous`, `Thous`, `H`, `T`, `O`],
                    rows: [
                      { label: `Digit`, cells: [`7`, `3`, `4`, `2`, `0`, `0`, `5`] },
                      { label: `Garage`, cells: [`full`, `full`, `full`, `full`, `empty`, `empty`, `full`] }
                    ]
                  }
                },
                {
                  stage: `Abstract`,
                  heading: `Use only the symbols`,
                  story: `Now put the garages away and use only numbers. To say a big number, read it in groups of three digits. The commas mark the groups. Say each group, then its name. So 7,342,005 is seven million, three hundred forty two thousand, five. To round, look at the digit just to the right of the place you are rounding to. If it is five or more, round up. If it is four or less, stay. To make a number 10 times larger, every digit hops one garage to the left. For 100 times larger, every digit hops two garages to the left, and zeros fill the empty spots.`,
                  plain: `Bigger by ten means slide every digit one step left. Bigger by one hundred means slide two steps left. The zeros are just placeholders so the digits land in the right garages.`,
                  visual: {
                    type: `pre`,
                    text: [
                      `Round 3,672 to the nearest hundred`,
                      `Target digit : 6 (hundreds)`,
                      `Peek at      : 7 (tens)`,
                      `7 is 5 or more, so go up`,
                      `Answer       : 3,700`
                    ].join('\n')
                  }
                }
              ],
              culture: {
                title: `Counting Patterns from First Peoples of BC`,
                text: `People in the land we now call British Columbia have counted for thousands of years, long before any textbook. Many First Nations used the body as a counting tool. One hand gives a group of five. Two hands give a group of ten. Hands and feet together give a group of twenty, which is one whole person. Tlingit is spoken in the northwest corner of BC, near Atlin, and in Alaska and the Yukon. In Tlingit, the number words for six, seven and eight are built from the words for one, two and three, which fits with counting on past the first hand. That is grouping and regrouping, the same big idea as our nesting garages, only with fives, tens and twenties.`,
                plain: `Counting in fives, tens and twenties is grouping. You fill a small group, then you name a bigger group. That is exactly what the garages do.`,
                activity: `Count 47 buttons by making groups of five. Then count them again with groups of twenty. Which way needs fewer groups? What is left over each time?`,
                respect: `Counting words and counting systems belong to the Nations who carry them. To hear the real words said properly, ask your teacher to connect with your local Indigenous Education Department or with Tlingit language speakers who are glad to share.`
              },
              recap: `Every digit is a garage size, and moving a digit one place left makes it ten times bigger.`
            },
            quest: [
              {
                id: `m1q1`,
                type: `choice`,
                skill: `Read and write numbers to 10 million`,
                prompt: `Which choice is the correct word form of 7,342,005?`,
                options: [
                  { text: `Seven million, three hundred forty two thousand, five hundred`, trap: `Look at the last group again. The 5 sits in the Ones column, so it is worth five, not five hundred. The Hundreds and Tens columns hold zeros.` },
                  { text: `Seventy three million, four hundred twenty thousand, five`, trap: `The 7 sits in the Millions column, so it is seven million, not seventy three million. Read the digits in groups of three.` },
                  { text: `Seven million, three hundred forty two thousand, five`, ok: true },
                  { text: `Seven million, three hundred four thousand, two hundred five`, trap: `That mixes up the digits. The Thousands group is 3, 4, 2, which reads three hundred forty two thousand. Then the Ones group is 0, 0, 5.` }
                ],
                hint: {
                  nudge: `Read the number in groups of three digits from the left. Say each group, then say its group name.`,
                  steps: [
                    `Put the digits in the place value chart. Start at the Ones column on the right and work backward so each digit lands in its own garage.`,
                    `Millions group: the digit 7 is in the Millions column, so you say seven million.`,
                    `Thousands group: the digits 3, 4 and 2 sit in H Thous, T Thous and Thous. Say the group as a number, then say thousand.`,
                    `Ones group: the digits 0, 0 and 5 sit in H, T and O. Zero hundreds and zero tens say nothing, so you only say the 5.`
                  ],
                  visual: {
                    type: `table`,
                    caption: `Where each digit of 7,342,005 sits`,
                    headers: [`Millions`, `H Thous`, `T Thous`, `Thous`, `H`, `T`, `O`],
                    rows: [
                      { label: `Digit`, cells: [`7`, `3`, `4`, `2`, `0`, `0`, `5`] },
                      { label: `Group`, cells: [`Millions`, `Thousands`, `Thousands`, `Thousands`, `Ones`, `Ones`, `Ones`] }
                    ]
                  }
                },
                solution: {
                  answer: `Seven million, three hundred forty two thousand, five`,
                  work: `Millions group: 7. Thousands group: 342. Ones group: 005, which is just five.`,
                  plain: `You say the big group, then the middle group with the word thousand, then the last group. Zeros at the front of a group are silent.`
                }
              },
              {
                id: `m1q2`,
                type: `number`,
                keyboard: `numeric`,
                placeholder: `Type a number`,
                skill: `Round whole numbers to the nearest ten thousand`,
                prompt: `Round 4,589,201 to the nearest ten thousand.`,
                answer: `4590000`,
                traps: [
                  { value: `4580000`, say: `You rounded down. Peek at the digit to the right of the ten thousands place. It is a 9, which is five or more, so the 8 must go up.` },
                  { value: `4589000`, say: `That is rounding to the nearest thousand. You need the ten thousands place, which is the T Thous column.` },
                  { value: `4600000`, say: `That is rounding to the nearest hundred thousand. Look one column to the right of that, at the T Thous column.` },
                  { value: `4589200`, say: `That is rounding to the nearest hundred. You need to round much higher, to the ten thousands place.` },
                  { value: `5000000`, say: `That is rounding to the nearest million. You need the ten thousands place, which is two columns to the right of the Millions column... count carefully.` }
                ],
                hint: {
                  nudge: `Find the digit in the ten thousands place, then peek at the digit just to its right.`,
                  steps: [
                    `Find the ten thousands place. It is the T Thous column, and the digit there is 8.`,
                    `Peek at the very next digit to the right, in the Thous column. It is a 9.`,
                    `The rule: five or more, round up. Four or less, stay the same. Is 9 five or more?`,
                    `Every digit to the right of your target place turns into a zero. Decide what the 8 becomes, then write your new number.`
                  ],
                  visual: {
                    type: `table`,
                    caption: `Rounding 4,589,201 to the nearest ten thousand`,
                    headers: [`Millions`, `H Thous`, `T Thous`, `Thous`, `H`, `T`, `O`],
                    rows: [
                      { label: `Digit`, cells: [`4`, `5`, `8`, `9`, `2`, `0`, `1`] },
                      { label: `Job`, cells: [`keep`, `keep`, `target`, `peek`, `zero`, `zero`, `zero`] }
                    ]
                  }
                },
                solution: {
                  answer: `4,590,000`,
                  work: `The target digit is 8 (ten thousands). The peek digit is 9, so the 8 rounds up to 9. Everything after it becomes zero.`,
                  plain: `4,589,201 is much closer to 4,590,000 than to 4,580,000, so that is where it lands.`
                }
              },
              {
                id: `m1q3`,
                type: `number`,
                keyboard: `numeric`,
                placeholder: `Type a number`,
                skill: `Multiply whole numbers by 100`,
                prompt: `What is 100 times larger than 45,000?`,
                answer: `4500000`,
                traps: [
                  { value: `450000`, say: `That is only 10 times larger. Hopping one garage to the left is times 10. You need to hop two garages for times 100.` },
                  { value: `45000000`, say: `That is 1,000 times larger. You hopped three garages. Times 100 is only two hops.` },
                  { value: `45100`, say: `It looks like you added 100. The words 100 times larger mean multiply by 100, not add 100.` },
                  { value: `4500`, say: `That is 10 times smaller, so the digits hopped the wrong way. Bigger numbers hop to the left.` }
                ],
                hint: {
                  nudge: `Times 100 means every digit hops two garages to the left.`,
                  steps: [
                    `Write 45,000 in the chart. The 4 is in T Thous and the 5 is in Thous. The other columns hold zeros.`,
                    `Times 10 means every digit hops one column to the left. Do that once.`,
                    `Times 10 again makes times 100. Every digit hops one more column to the left.`,
                    `Fill any empty columns behind the digits with zeros. Then read your new number.`
                  ],
                  visual: {
                    type: `table`,
                    caption: `Start with 45,000, then hop two columns to the left`,
                    headers: [`Millions`, `H Thous`, `T Thous`, `Thous`, `H`, `T`, `O`],
                    rows: [
                      { label: `Start`, cells: [`0`, `0`, `4`, `5`, `0`, `0`, `0`] },
                      { label: `Your turn`, cells: [`?`, `?`, `?`, `?`, `?`, `?`, `?`] }
                    ]
                  }
                },
                solution: {
                  answer: `4,500,000`,
                  work: `45,000 × 100 = 4,500,000. The 4 hops from ten thousands to millions and the 5 hops from thousands to hundred thousands.`,
                  plain: `Each hop to the left makes a digit ten times bigger. Two hops make it one hundred times bigger.`
                }
              }
            ]
          },

          /* ---------------- MODULE 2 ---------------- */
          {
            id: 2,
            title: `The Multiplication and Division Engine`,
            book: `Singapore Math 5A, Order of Operations, Multiplication and Division by a 2 Digit Number`,
            bc: `Use the order of operations, multiply and divide multi digit numbers, and solve problems with an unknown number.`,
            kidSummary: `Learn the traffic laws of math so everyone gets the same answer every time.`,
            bigIdea: {
              title: `The Ambulance and the Traffic Law`,
              hook: `Math has traffic laws. If two people follow different orders, they crash into different answers. The traffic law makes sure everybody arrives at the same answer.`,
              steps: [
                {
                  stage: `Concrete`,
                  heading: `Pull over for the ambulance`,
                  story: `Picture a busy road with three lanes. Suddenly you hear a siren. An ambulance is coming, and every car must pull over and let it go first. Brackets are the ambulance. Whatever is inside brackets goes first, no matter where it sits in the line. Next come the delivery trucks, which are multiplication and division. Trucks are twins. They share a lane and go in the order they arrive, from left to right. Last come the small cars, addition and subtraction. They are also twins who share a lane and go from left to right.`,
                  plain: `Brackets first. Then times and divide, left to right. Then add and take away, left to right. Times is not stronger than divide. They are twins, so whichever comes first on the left goes first.`,
                  visual: {
                    type: `pre`,
                    text: [
                      `LANE 1  Ambulance  ( brackets )`,
                      `LANE 2  Trucks     ×  and  ÷`,
                      `LANE 3  Cars       +  and  −`,
                      `Twins in a lane go left to right.`
                    ].join('\n')
                  }
                },
                {
                  stage: `Pictorial`,
                  heading: `Watch the traffic move`,
                  story: `Let us follow the traffic law with 30 − (2 × 5) + 6 ÷ 3. First the ambulance goes. The bracket holds 2 × 5, which is 10. Now the trucks go. The only truck left is 6 ÷ 3, which is 2. Now only cars are left: 30 − 10 + 2. Cars go left to right, so 30 − 10 is 20, and then 20 + 2 is 22.`,
                  plain: `Every time you finish a job, rewrite the whole problem with the new number in place. That keeps you from losing anything on the road.`,
                  visual: {
                    type: `pre`,
                    text: [
                      `30 − (2 × 5) + 6 ÷ 3`,
                      `Ambulance : (2 × 5) = 10`,
                      `            30 − 10 + 6 ÷ 3`,
                      `Trucks    : 6 ÷ 3 = 2`,
                      `            30 − 10 + 2`,
                      `Cars      : 30 − 10 = 20`,
                      `            20 + 2 = 22`
                    ].join('\n')
                  }
                },
                {
                  stage: `Abstract`,
                  heading: `Sharing with leftovers and missing numbers`,
                  story: `Division is fair sharing. Long division shares a big number into equal groups and tells you what is left over. Say 1,250 fans ride buses that seat 12 people each. Follow the loop: divide, multiply, subtract, bring down. 12 goes into 12 one time. Bring down the 5. 12 does not fit into 5, so write 0. Bring down the 0 to make 50. 12 goes into 50 four times, because 12 × 4 is 48. That leaves 2. So you fill 104 buses and 2 fans are left over. The leftover is called the remainder, and it must always be smaller than the number you divide by. For a missing number problem, undo with the opposite. If 6 × [ ? ] = 90 − 42, first find 90 − 42, which is 48. Then divide: 48 ÷ 6 = 8.`,
                  plain: `Times and divide undo each other, like tying and untying a shoe. When a number is hiding, use the opposite move to find it.`,
                  visual: {
                    type: `pre`,
                    text: [
                      `       104 r 2`,
                      `     ________`,
                      ` 12 ) 1250`,
                      `      12`,
                      `      __`,
                      `       05`,
                      `        0`,
                      `       __`,
                      `        50`,
                      `        48`,
                      `        __`,
                      `         2`
                    ].join('\n')
                  }
                }
              ],
              recap: `Brackets first, then times and divide, then add and take away, with twins going left to right.`
            },
            quest: [
              {
                id: `m2q1`,
                type: `number`,
                keyboard: `decimal`,
                placeholder: `Type a number`,
                skill: `Use the order of operations`,
                prompt: `Simplify: 45 + (12 × 3) − (48 ÷ 4)`,
                answer: `69`,
                traps: [
                  { value: `30.75`, say: `It looks like you went straight from left to right and ignored the brackets and the traffic law. The ambulances, which are the brackets, must go first.` },
                  { value: `123`, say: `It looks like you went left to right without the traffic law. Brackets first, then times and divide, then add and take away.` },
                  { value: `81`, say: `Good start! 45 + 36 is 81. But you forgot the second bracket. There is still a take away of (48 ÷ 4) to do.` },
                  { value: `93`, say: `You added the last part. Look at the sign in front of the second bracket. It is a take away, not a plus.` },
                  { value: `33`, say: `You took away 48 instead of 48 ÷ 4. The division inside the bracket goes first, before the take away.` }
                ],
                hint: {
                  nudge: `Ambulance first. Solve inside each bracket before you touch anything else.`,
                  steps: [
                    `Crush this FIRST: the bracket (12 × 3). It is an ambulance, so it goes before everything else. It becomes 36.`,
                    `Crush this SECOND: the other bracket (48 ÷ 4). It is also an ambulance. It becomes 12.`,
                    `Crush this THIRD: no brackets, trucks or extra jobs are left. Only adding and taking away remain, and they are twins. Go left to right: do the plus first, then do the take away.`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      `45 + (12 × 3) − (48 ÷ 4)`,
                      `45 +    36    −    12`,
                      `Now go left to right. Your turn.`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `69`,
                  work: `Brackets first: 12 × 3 = 36 and 48 ÷ 4 = 12. Then 45 + 36 = 81, and 81 − 12 = 69.`,
                  plain: `The brackets are ambulances, so they go first. After that only plus and take away are left, and you do them from left to right.`
                }
              },
              {
                id: `m2q2`,
                type: `divrem`,
                divisor: 12,
                skill: `Divide a four digit number by a two digit number with a remainder`,
                prompt: `Use long division to work out 5,432 ÷ 12. Give the quotient and the remainder.`,
                answer: [452, 8],
                traps: [
                  { value: [8, 452], say: `You swapped the boxes. The quotient is how many full groups you can make. The remainder is what is left over, and it is always smaller than 12.` },
                  { value: [452, 0], say: `Your number of full groups is right! But check whether 12 × your quotient reaches all the way to 5,432. Something is left over.` },
                  { value: [452, null], say: `Your quotient is right! Now check the leftover. Work out 12 × 452, then see how far that is from 5,432.` },
                  { value: [451, null], say: `Check your last step. After bringing down the 2 you should have 32, and 12 fits into 32 more than once.` },
                  { value: [453, null], say: `That is one group too many. Work out 12 × your quotient and check that it does not go past 5,432.` }
                ],
                hint: {
                  nudge: `Use the loop: divide, multiply, subtract, bring down. Start by asking how many times 12 fits into 54.`,
                  steps: [
                    `12 does not fit into 5, so use the first two digits and ask about 54.`,
                    `12 goes into 54 four times, because 12 × 4 = 48. Subtract to get 6.`,
                    `Bring down the 3 to make 63. 12 goes into 63 five times, because 12 × 5 = 60. Subtract to get 3.`,
                    `Bring down the 2 to make 32. How many times does 12 fit into 32? Multiply, subtract, and see what is left. That leftover is your remainder, and it must be smaller than 12.`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      `        4 5 ?`,
                      `     __________`,
                      ` 12 ) 5 4 3 2`,
                      `       4 8`,
                      `       ___`,
                      `         6 3`,
                      `         6 0`,
                      `         ___`,
                      `           3 2   <-- your turn`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `452 remainder 8`,
                  work: `12 × 452 = 5,424, and 5,432 − 5,424 = 8. The remainder 8 is smaller than 12, so we are done.`,
                  plain: `If 5,432 people ride buses that hold 12 each, you fill 452 buses and 8 people are left over for one more bus.`
                }
              },
              {
                id: `m2q3`,
                type: `number`,
                keyboard: `numeric`,
                placeholder: `Type the missing number`,
                skill: `Solve for an unknown number`,
                prompt: `Find the missing number: 7 × [ ? ] = 1,000 − 545`,
                answer: `65`,
                traps: [
                  { value: `455`, say: `That is 1,000 − 545, which is what 7 times the mystery number equals. The mystery number is one seventh of it, so divide by 7.` },
                  { value: `3185`, say: `You multiplied by 7. To undo a times 7, you need to divide by 7.` },
                  { value: `1545`, say: `You added 1,000 and 545. The sign between them is a take away.` }
                ],
                hint: {
                  nudge: `First find what 1,000 − 545 equals. Then ask: 7 times what makes that number?`,
                  steps: [
                    `Do the right side first: 1,000 − 545. If it is easier, count up from 545 to 1,000.`,
                    `Now you have 7 × [ ? ] = your answer. Times and divide undo each other.`,
                    `So [ ? ] = your answer ÷ 7. Try long division, or build with sevens: 7 × 60 = 420, then see how much is left to reach your number.`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      `7 × [ ? ] = 1,000 − 545`,
                      `7 × [ ? ] =    ?`,
                      `      [ ? ] =    ? ÷ 7`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `65`,
                  work: `1,000 − 545 = 455. Then 455 ÷ 7 = 65. Check: 7 × 65 = 455.`,
                  plain: `Seven groups of some number make 455. To find one group, share 455 into 7 equal parts. Each part is 65.`
                }
              }
            ]
          },

          /* ---------------- MODULE 3 ---------------- */
          {
            id: 3,
            title: `Fractions Operations`,
            book: `Singapore Math 5A, Fractions`,
            bc: `Multiply a fraction by a whole number and by another fraction, and divide a whole number by a unit fraction.`,
            kidSummary: `Find out why multiplying by a fraction can make a number smaller, and why dividing by a fraction can make it bigger.`,
            bigIdea: {
              title: `Slicing Up a Slice`,
              hook: `Multiplying usually makes numbers bigger. Fractions are the surprise. Multiply by a fraction smaller than one, and things get smaller. Here is the reason.`,
              steps: [
                {
                  stage: `Concrete`,
                  heading: `Half of a half`,
                  story: `You have a slice of pizza that is one half of the whole pizza. Your friend asks for half of your slice. You cut your slice into two equal pieces and hand one over. That piece is one half of one half, and it is one fourth of the whole pizza. You started with a half and ended up holding less. The secret word is of. One half of one half means one half times one half. Taking a part of something always leaves you with less than the thing you started with.`,
                  plain: `Times a fraction means take a part of it. A part is always smaller than the whole thing, so the answer shrinks.`,
                  visual: {
                    type: `pre`,
                    text: [
                      `Whole        [____________]`,
                      `1/2          [______]`,
                      `1/2 of 1/2   [___]`
                    ].join('\n')
                  }
                },
                {
                  stage: `Pictorial`,
                  heading: `Draw the parts`,
                  story: `Try 2/3 of 12 cookies. Draw 12 cookies and split them into 3 equal groups of 4. Take 2 of the groups. That is 8 cookies. So 2/3 × 12 = 8. The bottom number tells you how many equal groups to make. The top number tells you how many groups to take. Now a fraction of a fraction. For 1/2 × 3/4, draw a box cut into 4 columns and shade 3 of them. Then cut the box in half across, and keep the top half of the shaded part. The box now has 8 small pieces and 3 of them are shaded, so 1/2 × 3/4 = 3/8.`,
                  plain: `Multiply the tops to count the shaded pieces. Multiply the bottoms to count all the pieces. The answer says shaded pieces out of all pieces.`,
                  visual: {
                    type: `pre`,
                    text: [
                      `        fourths`,
                      `row 1  [#][#][#][ ]`,
                      `row 2  [ ][ ][ ][ ]`,
                      `3 boxes shaded out of 8 boxes`
                    ].join('\n')
                  }
                },
                {
                  stage: `Abstract`,
                  heading: `The rules in symbols`,
                  story: `To multiply fractions, multiply the numerators, the top numbers. Then multiply the denominators, the bottom numbers. Then simplify by dividing the top and bottom by a number that fits into both. Now for dividing. Ask how many pieces fit. How many halves are in 4 sandwiches? Each sandwich has 2 halves, so 4 sandwiches have 8 halves. So 4 ÷ 1/2 = 8. The shortcut is to flip the second fraction into its reciprocal and multiply. The reciprocal of 1/2 is 2/1, which is 2. Then 4 × 2 = 8.`,
                  plain: `When you divide by a tiny piece, lots of pieces fit, so the answer gets bigger. That is the opposite of multiplying by a small fraction, which makes a smaller answer.`,
                  visual: {
                    type: `pre`,
                    text: [
                      `4 ÷ 1/2`,
                      `flip 1/2 into 2/1`,
                      `change ÷ into ×`,
                      `4 × 2 = 8`
                    ].join('\n')
                  }
                }
              ],
              recap: `Times a fraction means take a part, so the answer shrinks. Divide by a fraction means count how many pieces fit, so the answer grows.`
            },
            quest: [
              {
                id: `m3q1`,
                type: `number`,
                keyboard: `text`,
                placeholder: `Type a whole number`,
                simplest: true,
                skill: `Multiply a fraction by a whole number`,
                prompt: `What is 3/4 × 24?`,
                answer: `18`,
                traps: [
                  { value: `72`, say: `You multiplied 3 × 24 but forgot to share by the 4 on the bottom. The bottom number tells you how many equal groups to make.` },
                  { value: `6`, say: `That is only one fourth of 24. The top number, 3, tells you to take three of those groups.` },
                  { value: `32`, say: `You divided 24 by 3/4. The sign is times, which means find a part of 24, not how many three fourths fit into it.` }
                ],
                hint: {
                  nudge: `Three fourths of 24 means find one fourth first, then take 3 of those.`,
                  steps: [
                    `The bottom number, 4, says cut 24 into 4 equal groups. Work out how many are in each group.`,
                    `The top number, 3, says take 3 of those groups. How many is 3 groups of that size?`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      `24 counters in 4 equal groups`,
                      `[ ? ] [ ? ] [ ? ] [ ? ]`,
                      `  1     2     3   not taken`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `18`,
                  work: `24 ÷ 4 = 6, then 6 × 3 = 18.`,
                  plain: `Cut 24 into 4 equal groups of 6. Three of the four groups make 18.`
                }
              },
              {
                id: `m3q2`,
                type: `number`,
                keyboard: `text`,
                placeholder: `Type a fraction like 3/5`,
                simplest: true,
                skill: `Multiply a fraction by a fraction`,
                prompt: `What is 2/3 × 4/5? Write your answer as a fraction in simplest form.`,
                answer: `8/15`,
                traps: [
                  { value: `6/8`, say: `You added the tops and the bottoms. For multiplying, you multiply them instead.` },
                  { value: `5/6`, say: `It looks like you flipped the second fraction, which is what we do for dividing. Here the sign is times, so there is no flip.` },
                  { value: `8/8`, say: `Check the bottom numbers. You need to multiply 3 and 5 for the new bottom number.` }
                ],
                hint: {
                  nudge: `Multiply tops with tops and bottoms with bottoms. Then check whether you can simplify.`,
                  steps: [
                    `Multiply the numerators, the two top numbers. That gives the new top number.`,
                    `Multiply the denominators, the two bottom numbers. That gives the new bottom number.`,
                    `Look for a common factor. Can you divide the top and the bottom by the same number bigger than 1? If yes, divide both to simplify. For example, 2/5 × 5/6 = 10/30, and dividing both by 10 gives 1/3.`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      ` 2     4     2 × 4`,
                      ` _  ×  _  =  _____`,
                      ` 3     5     3 × 5`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `8/15`,
                  work: `Tops: 2 × 4 = 8. Bottoms: 3 × 5 = 15. So the answer is 8/15. The numbers 8 and 15 share no factor bigger than 1, so it is already in simplest form.`,
                  plain: `Picture cutting a box into 15 tiny equal pieces and shading 8 of them. That shaded part is 2/3 of 4/5.`
                }
              },
              {
                id: `m3q3`,
                type: `number`,
                keyboard: `text`,
                placeholder: `Type a whole number`,
                simplest: true,
                skill: `Divide a whole number by a unit fraction`,
                prompt: `What is 6 ÷ 1/3?`,
                answer: `18`,
                traps: [
                  { value: `2`, say: `You did 6 ÷ 3. But you are dividing by one third, not by three. A third is small, so many thirds fit into 6.` },
                  { value: `1/18`, say: `You did 1/3 ÷ 6, which is the other way around. The order matters. Here you ask how many thirds fit into 6.` }
                ],
                hint: {
                  nudge: `Ask yourself: how many thirds fit into 6 wholes?`,
                  steps: [
                    `One whole holds 3 thirds. Picture 6 wholes, each cut into 3 equal pieces.`,
                    `Count all the thirds across the 6 wholes.`,
                    `The shortcut: flip 1/3 into its reciprocal, 3/1, and change the divide sign to a times sign. Then multiply.`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      `whole 1 : [1/3][1/3][1/3]`,
                      `whole 2 : [1/3][1/3][1/3]`,
                      `whole 3 : [1/3][1/3][1/3]`,
                      `wholes 4 to 6 : your turn`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `18`,
                  work: `6 ÷ 1/3 = 6 × 3 = 18.`,
                  plain: `Each whole holds 3 thirds. Six wholes hold 6 × 3 = 18 thirds.`
                }
              }
            ]
          },

          /* ---------------- MODULE 4 ---------------- */
          {
            id: 4,
            title: `Decimals Mastery`,
            book: `Singapore Math 5B, Decimals`,
            bc: `Decimals to thousandths. Add, round and multiply decimals in everyday problems.`,
            kidSummary: `Use a magic lens to zoom into the tiny spaces between whole numbers.`,
            bigIdea: {
              title: `The Magic Microscopic Lens`,
              hook: `Imagine you own a magic lens. Look through it at any number and it zooms in on the tiny space between whole numbers, where the decimals live.`,
              steps: [
                {
                  stage: `Concrete`,
                  heading: `Zoom in on a chocolate bar`,
                  story: `You have one whole chocolate bar. Cut it into 10 equal strips. One strip is one tenth. Now hold your magic lens over one strip and watch it split into 10 tiny squares. Each square is one hundredth of the bar. Zoom in one more time. Each square splits into 10 crumbs, and each crumb is one thousandth of the bar. Every zoom cuts a piece into ten smaller pieces, exactly like the garages, but going smaller instead of bigger.`,
                  plain: `The decimal point is a fence between whole things and pieces of things. Left of the point are whole bars. Right of the point are pieces. Each step to the right cuts the piece into ten smaller pieces.`,
                  visual: {
                    type: `table`,
                    caption: `The number 14.352 under the magic lens`,
                    headers: [`Tens`, `Ones`, `.`, `Tenths`, `Hundredths`, `Thousandths`],
                    rows: [
                      { label: `Digit`, cells: [`1`, `4`, `.`, `3`, `5`, `2`] }
                    ]
                  }
                },
                {
                  stage: `Pictorial`,
                  heading: `Line up the points`,
                  story: `To add decimals, line up the decimal points in a straight column, one above the other. This puts tenths over tenths and hundredths over hundredths, so every piece meets its own kind. Fill empty spots with zeros so both numbers have the same number of places. Add from the right, carry when you reach ten, and bring the decimal point straight down into the answer. To round, peek at the digit right after your target place. Look at 5.782 rounded to the nearest hundredth. The hundredths digit is 8. The thousandths digit is 2, which is four or less, so the 8 stays. The answer is 5.78.`,
                  plain: `Only add pieces of the same size. Lining up the points makes sure tenths are added to tenths, not to hundredths.`,
                  visual: {
                    type: `pre`,
                    text: [
                      `   3.400   (3.4 with zeros added)`,
                      ` + 2.750`,
                      ` _______`,
                      `   6.150`
                    ].join('\n')
                  }
                },
                {
                  stage: `Abstract`,
                  heading: `Multiply by ignoring the point`,
                  story: `To multiply a decimal by a whole number, ignore the decimal point and multiply as if both were whole numbers. Then put the point back so the answer has as many decimal places as the decimal you started with. Take 0.3 × 4. Ignore the point and do 3 × 4 = 12. The 0.3 had one decimal place, so the answer has one decimal place. That makes 1.2. Try 0.25 × 8. Do 25 × 8 = 200. The 0.25 had two decimal places, so the answer has two: 2.00, which is the same as 2.`,
                  plain: `Think of 0.3 as three tenths. Four groups of three tenths is twelve tenths, and twelve tenths is 1.2.`,
                  visual: {
                    type: `pre`,
                    text: [
                      `0.3 × 4`,
                      `3 × 4 = 12`,
                      `one place after the point`,
                      `so the answer is 1.2`
                    ].join('\n')
                  }
                }
              ],
              recap: `Line up the decimal points before you add, look one place to the right before you round, and count decimal places when you multiply.`
            },
            quest: [
              {
                id: `m4q1`,
                type: `number`,
                keyboard: `decimal`,
                placeholder: `Type a decimal`,
                skill: `Add decimals to thousandths`,
                prompt: `Add: 14.35 + 7.892`,
                answer: `22.242`,
                traps: [
                  { value: `93.27`, say: `You lined up the right edges of the numbers instead of the decimal points. Put the point over the point, and add a zero to 14.35 so the places match.` },
                  { value: `21.242`, say: `Nearly there! You forgot one carry. When the tenths add to ten or more, carry 1 into the ones place.` },
                  { value: `22.24`, say: `You dropped the thousandths digit. 14.35 has no thousandths, so it becomes 14.350, and the 2 from 7.892 still counts.` }
                ],
                hint: {
                  nudge: `Line the decimal points up in a straight column before you add anything.`,
                  steps: [
                    `Write one number under the other with the decimal points directly above each other.`,
                    `Fill the empty spot with a zero. 14.35 becomes 14.350, so both numbers have three decimal places.`,
                    `Add from the right: thousandths, then hundredths, then tenths. Carry 1 whenever a column reaches 10 or more.`,
                    `Bring the decimal point straight down into your answer, then add the ones and tens.`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      `   14.350   (zero added)`,
                      ` +  7.892`,
                      ` ________`,
                      `      ?`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `22.242`,
                  work: `14.350 + 7.892. Thousandths: 0 + 2 = 2. Hundredths: 5 + 9 = 14, write 4 and carry 1. Tenths: 3 + 8 + 1 = 12, write 2 and carry 1. Ones: 4 + 7 + 1 = 12, write 2 and carry 1. Tens: 1 + 1 = 2.`,
                  plain: `You are adding pieces of the same size, so line them up and carry whenever a column fills to ten, just like the garages.`
                }
              },
              {
                id: `m4q2`,
                type: `number`,
                keyboard: `decimal`,
                placeholder: `Type a decimal`,
                skill: `Round decimals to the nearest hundredth`,
                prompt: `Round 3.456 to the nearest hundredth.`,
                answer: `3.46`,
                traps: [
                  { value: `3.45`, say: `You rounded down. Peek at the thousandths digit, which is 6. Six is five or more, so the hundredths digit goes up.` },
                  { value: `3.5`, say: `That is rounding to the nearest tenth. Hundredths is the second digit after the decimal point.` },
                  { value: `3`, say: `That is rounding to the nearest whole number. Keep two digits after the decimal point for hundredths.` },
                  { value: `3.456`, say: `That is the same number you started with. Rounding means you drop the last digit and decide whether to go up.` }
                ],
                hint: {
                  nudge: `The hundredths place is the second digit after the point. Peek at the digit just after it.`,
                  steps: [
                    `Find the hundredths digit. It is the second digit after the decimal point.`,
                    `Peek at the thousandths digit, the one right after it.`,
                    `Five or more, round up. Four or less, stay. Then write the answer with only two digits after the point.`
                  ],
                  visual: {
                    type: `table`,
                    caption: `Rounding 3.456 to the nearest hundredth`,
                    headers: [`Ones`, `.`, `Tenths`, `Hundredths`, `Thousandths`],
                    rows: [
                      { label: `Digit`, cells: [`3`, `.`, `4`, `5`, `6`] },
                      { label: `Job`, cells: [`keep`, ``, `keep`, `target`, `peek`] }
                    ]
                  }
                },
                solution: {
                  answer: `3.46`,
                  work: `The hundredths digit is 5. The thousandths digit is 6, which is five or more, so the 5 goes up to 6. The answer is 3.46.`,
                  plain: `3.456 is closer to 3.46 than to 3.45, so we round to 3.46.`
                }
              },
              {
                id: `m4q3`,
                type: `number`,
                keyboard: `decimal`,
                placeholder: `Type a decimal`,
                skill: `Multiply a decimal by a one digit whole number`,
                prompt: `Multiply: 0.45 × 6`,
                answer: `2.7`,
                traps: [
                  { value: `27`, say: `You forgot to put the decimal point back. 0.45 has two decimal places, so your answer needs two decimal places too.` },
                  { value: `270`, say: `You multiplied 45 × 6 correctly, but you left out the decimal point. Slide it in so there are two digits after it.` },
                  { value: `0.27`, say: `Your decimal point is one place too far to the left. The answer must have exactly two decimal places.` }
                ],
                hint: {
                  nudge: `Ignore the point, multiply 45 × 6, then count decimal places to put it back.`,
                  steps: [
                    `Pretend there is no decimal point and multiply 45 × 6. Do the tens and ones one at a time.`,
                    `0.45 has two digits after the point, so your answer needs two digits after the point too.`,
                    `Slide the decimal point into your product so it has two decimal places. If the last digit is a zero, you can drop it.`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      `0.45   becomes   45   (2 places)`,
                      `  × 6              × 6`,
                      `                  ____`,
                      `                    ?`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `2.7`,
                  work: `45 × 6 = 270. The 0.45 has two decimal places, so 270 becomes 2.70, which is the same as 2.7.`,
                  plain: `0.45 is 45 hundredths. Six groups of 45 hundredths is 270 hundredths, and 270 hundredths is 2.70.`
                }
              }
            ]
          },

          /* ============---- MODULE 5 ============---- */
          {
            id: 5,
            title: `Ratios and Before and After Models`,
            book: `Singapore Math 5A, Ratio`,
            bc: `Multiplicative comparison, equivalent ratios, and unit rates used to solve real problems.`,
            kidSummary: `Use secret recipes and bar models to compare amounts and to track what changes and what stays the same.`,
            bigIdea: {
              title: `The Secret Recipe Formula`,
              hook: `A wizard has a secret potion recipe. Make the potion bigger or smaller, and it still has to taste the same. Ratios are how the wizard keeps the recipe perfect.`,
              steps: [
                {
                  stage: `Concrete`,
                  heading: `Scale the potion`,
                  story: `The wizard mixes 3 scoops of moonberry juice with 5 scoops of dragon dew. We write that as the ratio 3 : 5, and we say 3 to 5. Now the whole village wants potion. The wizard makes a double batch, with 6 scoops of moonberry and 10 scoops of dragon dew. Then a triple batch, with 9 and 15. The potion tastes exactly the same every time, because the amounts grow together. Each batch has the same ratio, so 3 : 5, 6 : 10 and 9 : 15 are called equivalent ratios. To find one, multiply both parts by the same number, or divide both parts by the same number.`,
                  plain: `A ratio compares two amounts. To keep a recipe the same, whatever you do to one side you must do to the other side. Never add the same number to both sides. Multiply or divide both sides.`,
                  visual: {
                    type: `table`,
                    caption: `Equivalent batches of the potion`,
                    headers: [`Moonberry`, `Dragon dew`],
                    rows: [
                      { label: `1 batch`, cells: [`3`, `5`] },
                      { label: `2 batches`, cells: [`6`, `10`] },
                      { label: `3 batches`, cells: [`9`, `15`] },
                      { label: `4 batches`, cells: [`12`, `?`] }
                    ]
                  }
                },
                {
                  stage: `Pictorial`,
                  heading: `Draw the potion as bars`,
                  story: `Singapore Math draws ratios as bars. Every equal box in the bar is called a unit. Say the wizard's ratio of red potion bottles to blue potion bottles is 3 : 2. Draw 3 units for red and 2 units for blue, and make every unit the same size. If we are told the red bottles total 15, then 3 units equal 15. So 1 unit equals 15 ÷ 3, which is 5. The blue bottles are 2 units, and 2 × 5 is 10. Always follow this order: find what one unit is worth, then use it to find anything else.`,
                  plain: `A unit is just one small box. All boxes in a picture are the same size. Once you know what one box is worth, every other answer is easy.`,
                  visual: {
                    type: `pre`,
                    text: [
                      `Red   [ 5 ][ 5 ][ 5 ]   3 units = 15`,
                      `Blue  [ 5 ][ 5 ]        2 units = ?`,
                      ``,
                      `1 unit = 15 ÷ 3 = 5`,
                      `2 units = 2 × 5 = 10`
                    ].join('\n')
                  }
                },
                {
                  stage: `Abstract`,
                  heading: `The Before and After rule`,
                  story: `Some problems change over time. Singapore Math draws one bar model for Before and one for After. The secret is to find the invariant, the part that does NOT change, and use it to link the two pictures. There are three classic invariants. One: if someone gives some of their things to a friend, the total stays the same. Two: if both people get or lose the same amount, the difference stays the same. Three: if only one person changes, the other person's amount stays the same. Here is an example. Two wizards have gems in the ratio 5 : 3, and 40 gems in all. Before, that is 8 units, so 1 unit is 5 gems. The first wizard has 25 gems and the second has 15. Then the first wizard gives 5 gems to the second. The total is still 40 because gems were only moved. After, they each have 20 gems, so the ratio is 1 : 1.`,
                  plain: `Before and After problems are like a video with two frames. Ask yourself: what stayed exactly the same between the frames? Use that to connect the two frames.`,
                  visual: {
                    type: `pre`,
                    text: [
                      `BEFORE (5 : 3, total 40)`,
                      `Wizard 1 [5][5][5][5][5]  25`,
                      `Wizard 2 [5][5][5]        15`,
                      ``,
                      `Wizard 1 gives 5 gems away`,
                      `Total stays the same: 40`,
                      ``,
                      `AFTER  (1 : 1, total 40)`,
                      `Wizard 1 [20]`,
                      `Wizard 2 [20]`
                    ].join('\n')
                  }
                }
              ],
              recap: `Keep the ratio by multiplying or dividing both parts, find what one unit is worth, and in Before and After problems look for the part that stays the same.`
            },
            quest: [
              {
                id: `m5q1`,
                type: `number`,
                keyboard: `numeric`,
                placeholder: `Type the missing number`,
                skill: `Find an equivalent ratio`,
                prompt: `Find the missing number: 3 : 5 = 12 : [ ? ]`,
                answer: `20`,
                traps: [
                  { value: `14`, say: `You added 9 to both sides because 3 plus 9 makes 12. Ratios grow by multiplying, not adding. Find how many times bigger 12 is than 3.` },
                  { value: `4`, say: `The number 4 is how many times bigger the recipe got. That is the scale factor, not the missing amount. Use it to grow the 5 as well.` },
                  { value: `60`, say: `You multiplied 12 by 5. Instead, find what you multiplied 3 by to get 12, then do the same to the 5.` }
                ],
                hint: {
                  nudge: `Ask what you multiplied 3 by to get 12. Then do the very same thing to 5.`,
                  steps: [
                    `Look at the left side of each ratio: 3 turned into 12. How many times bigger is 12 than 3? Work it out with 12 ÷ 3.`,
                    `Both sides of a ratio must grow by the same number of times. So multiply the 5 by that same number.`,
                    `Check by dividing your two new numbers: they should simplify back to 3 : 5.`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      ` 3  :  5`,
                      ` ×?    ×?   (same number both times)`,
                      `12  :  ?`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `20`,
                  work: `12 ÷ 3 = 4, so the recipe was made 4 times bigger. Then 5 × 4 = 20. So 3 : 5 = 12 : 20.`,
                  plain: `The wizard made 4 batches. 4 batches of 5 scoops of dragon dew is 20 scoops.`
                }
              },
              {
                id: `m5q2`,
                type: `number`,
                keyboard: `numeric`,
                placeholder: `Type a whole number`,
                skill: `Solve a ratio word problem with a bar model`,
                prompt: `The ratio of red balloons to blue balloons is 3 : 2. There are 30 red balloons. What is the total number of balloons?`,
                answer: `50`,
                traps: [
                  { value: `20`, say: `That is the number of blue balloons. The question asks for the total, which means red and blue together.` },
                  { value: `150`, say: `You multiplied 30 by the 5 units. But 30 is not the value of one unit. 30 is the value of the 3 red units together.` },
                  { value: `32`, say: `You added 30 and 2. The 2 in the ratio means 2 units, not 2 balloons. First find what one unit is worth.` }
                ],
                hint: {
                  nudge: `Draw a bar for red and a bar for blue. Find what one unit is worth, then count all the units.`,
                  steps: [
                    `Red has 3 units and blue has 2 units. The 30 red balloons are shared over the 3 red units.`,
                    `3 units = 30 balloons, so 1 unit = 30 ÷ 3 = 10 balloons.`,
                    `Total units = 3 + 2 = 5 units.`,
                    `Now finish it yourself: 5 units of 10 balloons each. How many balloons is that?`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      `Red   [10][10][10]   3 units = 30`,
                      `Blue  [ ?][ ?]       2 units = ?`,
                      ``,
                      `Total = 5 units`,
                      `5 units = 5 × 10 = ?`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `50`,
                  work: `3 units = 30, so 1 unit = 10. Blue is 2 units, which is 20. Total is 5 units, which is 5 × 10 = 50.`,
                  plain: `Each box in the picture holds 10 balloons. There are 5 boxes in all, so there are 50 balloons.`
                }
              },
              {
                id: `m5q3`,
                type: `number`,
                keyboard: `decimal`,
                placeholder: `Type the distance in kilometers`,
                skill: `Scale a rate`,
                prompt: `A drone flies 15 kilometers in 3 hours. At that exact rate, how many kilometers can it fly in 8 hours?`,
                answer: `40`,
                traps: [
                  { value: `5`, say: `That is how far the drone flies in just 1 hour. The question asks about 8 hours, so you need 8 of those hours.` },
                  { value: `120`, say: `You multiplied 15 by 8, but 15 kilometers is the trip for 3 hours, not for 1 hour. Find the distance for 1 hour first.` },
                  { value: `45`, say: `That is 15 × 3. To scale a rate, find the distance for 1 hour, then multiply by the new number of hours.` }
                ],
                hint: {
                  nudge: `Find how far the drone flies in 1 hour first. Then scale up to 8 hours.`,
                  steps: [
                    `15 kilometers happen over 3 hours. Share it equally: 15 ÷ 3 gives the distance for 1 hour. This is called the unit rate.`,
                    `8 hours is 8 lots of 1 hour. Multiply the unit rate by 8.`,
                    `Calculator unlocked: use it to check your multiplication after you work it out by hand.`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      `3 hours  [15 km]`,
                      `1 hour   [ ?  km]`,
                      `8 hours  [ ?  ] × 8 = ?`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `40 kilometers`,
                  work: `15 ÷ 3 = 5 kilometers each hour. Then 5 × 8 = 40 kilometers.`,
                  plain: `The drone flies 5 kilometers every hour. After 8 hours, it has done that 8 times, so it flies 40 kilometers.`
                }
              }
            ]
          },

          /* ============---- MODULE 6 ============---- */
          {
            id: 6,
            title: `Percentages and Financial Scale`,
            book: `Singapore Math 5B, Percentage`,
            bc: `Percent as a part of 100, connections between fractions, decimals and percent, and financial literacy such as discounts and taxes.`,
            kidSummary: `Learn what out of a hundred means and use it to work out sale prices and taxes.`,
            bigIdea: {
              title: `Out of a Hundred: The Inventory Chest`,
              hook: `A medieval merchant keeps every treasure in a chest with exactly 100 slots. Once you know how the chest works, you can work out any discount or tax in your head.`,
              steps: [
                {
                  stage: `Concrete`,
                  heading: `Count the slots in the chest`,
                  story: `The merchant's chest has 100 slots, in 10 rows of 10. Say 25 of the slots hold silver coins. The merchant says that 25 out of 100 slots are silver, or 25 percent. The word percent comes from a very old phrase that means for each hundred. The sign is %. So 25% is the same as the fraction 25 over 100, and the same as the decimal 0.25. If 50 slots hold gold, that is 50%, which is one half. If 10 slots hold rubies, that is 10%, which is one tenth.`,
                  plain: `Percent means out of one hundred. It is a fraction where the bottom number is always 100.`,
                  visual: {
                    type: `table`,
                    caption: `The same amount written three ways`,
                    headers: [`Fraction`, `Decimal`, `Percent`],
                    rows: [
                      { label: `Silver`, cells: [`25/100`, `0.25`, `25%`] },
                      { label: `Gold`, cells: [`50/100`, `0.50`, `50%`] },
                      { label: `Rubies`, cells: [`10/100`, `0.10`, `10%`] }
                    ]
                  }
                },
                {
                  stage: `Pictorial`,
                  heading: `Make the bottom number 100`,
                  story: `What if a fraction does not have 100 on the bottom? Change it so it does. Take 3 out of 20 slots. To turn 20 into 100, multiply by 5. Do the same to the top, so 3 × 5 is 15. That gives 15 over 100, which is 15%. Now find a percent of an amount. To find 10% of $80, remember that 10% is one tenth, so share $80 into 10 parts of $8. To find 25%, think of one quarter. To find any percent, change it to a decimal first, then multiply. 30% is 0.30, and 0.30 × $80 is $24.`,
                  plain: `To turn a fraction into a percent, grow or shrink the bottom to 100 and do the exact same thing to the top.`,
                  visual: {
                    type: `pre`,
                    text: [
                      ` 3     ?      15`,
                      `___ = ___  =  ___  = 15%`,
                      `20    100     100`,
                      `× 5 on the top and the bottom`
                    ].join('\n')
                  }
                },
                {
                  stage: `Abstract`,
                  heading: `Discounts and taxes with a $1,000 budget`,
                  story: `Here is how percent shows up in real BC shopping. A discount takes money off, so you subtract. A sales tax adds money on, so you add. In BC, most things carry 5 percent GST, and many goods also carry 7 percent PST. Rates can change, so always check your receipt. The steps never change. Step one: turn the percent into a decimal by dividing by 100. Step two: multiply that decimal by the price to find the discount or the tax. Step three: subtract the discount from the price, or add the tax to the price. Suppose you have a $1,000 budget and you want a $200 helmet that is on sale for 10% off. The discount is $200 × 0.10, which is $20. The sale price is $180. Now add 5% tax on $180. That is $180 × 0.05, which is $9. You pay $189, and you have $811 left in your budget.`,
                  plain: `Percent of a price is a small piece of the price. A discount is a piece you take away. A tax is a piece you have to add. Always work out the piece first, then decide whether to subtract it or add it.`,
                  visual: {
                    type: `pre`,
                    text: [
                      `Helmet price      $200`,
                      `10% off           − $20`,
                      `Sale price        $180`,
                      `5% tax on $180    + $9`,
                      `You pay           $189`,
                      `Budget left       $1,000 − $189 = $811`
                    ].join('\n')
                  }
                }
              ],
              recap: `Turn the percent into a decimal, multiply to find the piece, then subtract it for a discount or add it for a tax.`
            },
            quest: [
              {
                id: `m6q1`,
                type: `number`,
                keyboard: `decimal`,
                placeholder: `Type the percent`,
                skill: `Convert a fraction to a percent`,
                prompt: `Express 18/25 as a percent.`,
                answer: `72`,
                traps: [
                  { value: `0.72`, say: `You found the decimal. That is right on the way, but a percent is the decimal times 100. 0.72 is the same as 72 out of 100, which is 72%.` },
                  { value: `18`, say: `That is just the top number. The bottom number 25 has to become 100, and the top must change by the same amount.` },
                  { value: `7.2`, say: `Your decimal point slipped one place. Grow 25 into 100 and do the same to 18 to see the answer.` }
                ],
                hint: {
                  nudge: `Percent means out of 100. Turn the bottom number 25 into 100 and do the same to the top.`,
                  steps: [
                    `How many times does 25 fit into 100? Work out 100 ÷ 25.`,
                    `Multiply the bottom number by that amount to get 100. Multiply the top number 18 by the exact same amount.`,
                    `Your new fraction is something over 100. The number on top is the percent.`,
                    `Calculator unlocked: you can check by working out 18 ÷ 25 and moving the decimal point two places to the right.`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      `18      ?`,
                      `__  =  ___  = ?%`,
                      `25     100`,
                      `multiply top and bottom by the same number`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `72%`,
                  work: `100 ÷ 25 = 4. Multiply top and bottom by 4: 18 × 4 = 72 and 25 × 4 = 100. So 18/25 = 72/100 = 72%.`,
                  plain: `If the chest has 25 slots and 18 are filled, then a chest with 100 slots would have 72 filled.`
                }
              },
              {
                id: `m6q2`,
                type: `number`,
                keyboard: `decimal`,
                placeholder: `Type the sale price in dollars`,
                skill: `Calculate a sale price after a percent discount`,
                prompt: `An enchanted shield costs $400, but it is on sale for 25% off. What is the new sale price?`,
                answer: `300`,
                traps: [
                  { value: `100`, say: `That is the amount of the discount, not the new price. You still need to take the discount away from $400.` },
                  { value: `375`, say: `You took away 25 dollars. But 25% means 25 out of every 100, which is a much bigger amount when the price is $400.` },
                  { value: `500`, say: `You added the discount. A sale takes money off, so you subtract.` }
                ],
                hint: {
                  nudge: `First turn 25% into a decimal and find the discount. Then subtract it from the price.`,
                  steps: [
                    `Turn the percent into a decimal: 25% = 25 ÷ 100 = 0.25.`,
                    `Multiply the decimal by the price to find the discount: 400 × 0.25.`,
                    `A sale means money off, so subtract the discount from the original price of $400.`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      `25% = 25/100 = 0.25`,
                      `Discount  = $400 × 0.25 = $?`,
                      `New price = $400 − discount = $?`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `$300`,
                  work: `25% = 0.25. The discount is $400 × 0.25 = $100. The new price is $400 − $100 = $300.`,
                  plain: `25% is the same as one quarter. One quarter of $400 is $100, so the shield gets $100 cheaper and costs $300.`
                }
              },
              {
                id: `m6q3`,
                type: `number`,
                keyboard: `decimal`,
                placeholder: `Type the total cost in dollars`,
                skill: `Calculate a total cost with sales tax`,
                prompt: `Find the total cost of a $120 item if the sales tax adds an extra 5% onto the price.`,
                answer: `126`,
                traps: [
                  { value: `6`, say: `That is only the tax. The total cost is the price of the item plus the tax on top of it.` },
                  { value: `125`, say: `You added 5 dollars. But 5% of $120 is not 5 dollars. Turn 5% into 0.05 and multiply by $120.` },
                  { value: `114`, say: `You took the tax away. Sales tax is an extra charge, so you add it to the price.` }
                ],
                hint: {
                  nudge: `Turn 5% into a decimal, find the tax, then add it to the price.`,
                  steps: [
                    `Turn the percent into a decimal: 5% = 5 ÷ 100 = 0.05.`,
                    `Multiply the decimal by the price to find the tax: 120 × 0.05.`,
                    `Tax is an extra charge, so add the tax to the original price of $120.`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      `5% = 5/100 = 0.05`,
                      `Tax   = $120 × 0.05 = $?`,
                      `Total = $120 + tax   = $?`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `$126`,
                  work: `5% = 0.05. The tax is $120 × 0.05 = $6. The total is $120 + $6 = $126.`,
                  plain: `5 out of every 100 dollars is tax. For $120, that is a little more than 1 chunk of 100, so the tax is $6 and you pay $126.`
                }
              }
            ]
          },

          /* ============---- MODULE 7 ============---- */
          {
            id: 7,
            title: `Angular Systems and Geometry`,
            book: `Singapore Math 5A, Angles`,
            bc: `Measure angles, and use angle properties of triangles and parallelograms to find unknown angles.`,
            kidSummary: `Discover why the three corners of every triangle always make a flat runway.`,
            bigIdea: {
              title: `The Sharp Turn Runway`,
              hook: `Every triangle hides a secret. Its three corners always add up to the same number, no matter how big, small, tall or skinny the triangle is.`,
              steps: [
                {
                  stage: `Concrete`,
                  heading: `Tear the corners and make a runway`,
                  story: `Cut out any triangle from paper. Tear off its three corners and line them up so the points all touch and the corners sit side by side. The three corners fit together perfectly into a straight line. A straight line is a flat runway, and a flat runway is exactly 180 degrees. Try it again with a fat triangle and a skinny triangle. The runway is always flat. We write degrees with a small circle, like 180°. A right angle, the corner of a book, is 90°. Two right angles make one flat runway.`,
                  plain: `An angle measures how much a corner is open. A straight line is a half turn, which is 180°. The three corners of any triangle always fill a straight line exactly.`,
                  visual: {
                    type: `pre`,
                    text: [
                      `Three torn corners in a row:`,
                      ``,
                      `  A  |  B  |  C`,
                      `_____|_____|_____   a flat runway`,
                      `A + B + C = 180°`
                    ].join('\n')
                  }
                },
                {
                  stage: `Pictorial`,
                  heading: `Split the runway into three parts`,
                  story: `Draw the flat runway as one long bar labeled 180°. Split it into three parts, one for each corner. Say a triangle has corners of 50° and 60°. Put those two parts on the runway. The bit of runway that is left over must belong to the third corner. Add 50 and 60 to get 110, and 180 minus 110 leaves 70. So the third corner is 70°. Special triangles have shortcuts. A right triangle has one 90° corner, so the other two corners must share the leftover 90°. For four sided shapes, a parallelogram has two pairs of parallel sides. Corners that sit next to each other along a side add to 180°, and the corners opposite each other are equal.`,
                  plain: `When you know two corners, add them up and see how much of the runway is left. Whatever is left belongs to the last corner.`,
                  visual: {
                    type: `pre`,
                    text: [
                      `[ 50° ][ 60° ][  ?  ]`,
                      `|====== 180° ======|`,
                      `50 + 60 = 110`,
                      `180 − 110 = 70°`
                    ].join('\n')
                  }
                },
                {
                  stage: `Abstract`,
                  heading: `The subtraction chain`,
                  story: `Now use only numbers. For the third angle of a triangle, subtract both known angles from 180 in a chain. For example, 180 − 50 − 60 = 70. You can subtract one at a time: 180 − 50 = 130, then 130 − 60 = 70. Or you can add first and subtract once: 50 + 60 = 110, then 180 − 110 = 70. Both ways give the same answer. In a right triangle, the two sharp corners always add to 90°, because 180 − 90 = 90. In a parallelogram, if one corner is a certain size, its neighbor is 180 minus that size.`,
                  plain: `The subtraction chain is like paying a bill from a $180 wallet. Take away each known angle one at a time, and what is left in the wallet is the missing angle.`,
                  visual: {
                    type: `pre`,
                    text: [
                      `Triangle: 180 − 50 − 60 = 70`,
                      `Right triangle: 90 + 40 + ? = 180`,
                      `                ? = 180 − 90 − 40 = 50`,
                      `Parallelogram neighbors: 180 − 75 = 105`
                    ].join('\n')
                  }
                }
              ],
              culture: {
                title: `Balance in Tsimshian and Northwest Coast Design`,
                text: `Northwest Coast artists, including Tsimshian artists whose Nations live along the Skeena River, the Nass River and around Prince Rupert, have long used balance and mirror lines in their designs. Many masks, painted box fronts, and carved pieces are built with a line of symmetry down the middle, so the left half and the right half match. This is called bilateral symmetry. Each half uses careful shapes and curves, and matching angles and lengths on both sides is part of what makes a design feel balanced. Symmetry is a big idea in geometry too. When you fold a shape along its line of symmetry, the corners on one side land exactly on the corners on the other side, so matching angles have the same measure.`,
                plain: `A line of symmetry is a mirror line. Fold along it and both halves match exactly, including their angles.`,
                activity: `Fold a sheet of paper in half and draw half of a design starting at the fold. Cut it out and open it. Now measure two matching angles on the left and right halves. What do you notice about them?`,
                respect: `Designs, crests and stories in Northwest Coast art belong to families and Nations. Make your own original designs and please do not copy crest designs. To learn more, ask your teacher to connect with your local Indigenous Education Department or with Tsimshian artists and educators.`
              },
              recap: `The three corners of every triangle add to 180°, so subtract the angles you know from 180 to find the one you do not.`
            },
            quest: [
              {
                id: `m7q1`,
                type: `number`,
                keyboard: `numeric`,
                placeholder: `Type the angle in degrees`,
                skill: `Find an unknown angle in a triangle`,
                prompt: `A triangle has interior angles measuring 45° and 65°. What is the measurement of the third unknown angle?`,
                answer: `70`,
                traps: [
                  { value: `110`, say: `You added 45 and 65, which is a good first step. But 110 is the runway used up, not the corner that is left. Take it away from 180.` },
                  { value: `115`, say: `You took only 65 away from 180. The 45° corner also uses up part of the runway, so subtract it too.` },
                  { value: `135`, say: `You took only 45 away from 180. The 65° corner also uses up part of the runway, so subtract it too.` }
                ],
                hint: {
                  nudge: `The three angles of any triangle add to 180°. Subtract the two you know.`,
                  steps: [
                    `Start with the full runway of 180°.`,
                    `Take away the first known angle: 180 − 45 = ?`,
                    `Take away the second known angle from that answer: ? − 65 = the third angle.`,
                    `Check: your three angles should add back up to 180.`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      `[ 45° ][ 65° ][  ?  ]`,
                      `|====== 180° ======|`,
                      `180 − 45 = ?`,
                      `?   − 65 = third angle`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `70°`,
                  work: `180 − 45 = 135, then 135 − 65 = 70. Check: 45 + 65 + 70 = 180.`,
                  plain: `The runway is 180 long. The first two corners use up 110 of it, and the last 70 belongs to the third corner.`
                }
              },
              {
                id: `m7q2`,
                type: `number`,
                keyboard: `numeric`,
                placeholder: `Type the angle in degrees`,
                skill: `Find a consecutive angle in a parallelogram`,
                prompt: `In a parallelogram, one interior angle is 110°. What is the measurement of its consecutive adjacent interior angle?`,
                answer: `70`,
                traps: [
                  { value: `110`, say: `The angle that is equal to 110° is the corner directly opposite it, not the one next to it. Neighbors along a side are different.` },
                  { value: `250`, say: `You took 110 away from 360. In a parallelogram, neighbors along a side share a straight line of 180°, not 360°.` },
                  { value: `180`, say: `180° is what the two neighbors add up to. You still need to take away the 110° angle to find the neighbor by itself.` }
                ],
                hint: {
                  nudge: `Two angles that sit next to each other along a side of a parallelogram add up to 180°.`,
                  steps: [
                    `In a parallelogram, the opposite sides are parallel. That makes two neighbors along a side fill a flat runway together.`,
                    `So the given angle plus its neighbor equals 180°.`,
                    `Subtract the angle you know from 180 to find the neighbor.`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      `110° + ?° = 180°`,
                      `?° = 180° − 110°`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `70°`,
                  work: `Neighbors add to 180°. 180 − 110 = 70.`,
                  plain: `Two neighbors along a side of a parallelogram always share one flat runway of 180°. If one takes 110, the other only gets the 70 that is left.`
                }
              },
              {
                id: `m7q3`,
                type: `number`,
                keyboard: `numeric`,
                placeholder: `Type the angle in degrees`,
                skill: `Find an unknown angle in a right triangle`,
                prompt: `A right angled triangle has one sharp corner measuring 32°. What does the remaining non 90° corner angle measure?`,
                answer: `58`,
                traps: [
                  { value: `148`, say: `You subtracted only 32 from 180. But a right triangle also has a 90° corner, which uses up part of the runway too.` },
                  { value: `122`, say: `You added 90 and 32. Those two are already used up. The runway is 180, so subtract them from 180.` },
                  { value: `90`, say: `90 is what the two sharp corners add up to. You still need to take the 32° away from it.` }
                ],
                hint: {
                  nudge: `Every triangle adds to 180°, and a right triangle already has a 90° corner.`,
                  steps: [
                    `Start with the full runway of 180°.`,
                    `Take away the right angle: 180 − 90 = ?`,
                    `Take away the 32° corner: ? − 32 = the last angle.`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      `180 − 90 = ?`,
                      `?   − 32 = last angle`,
                      `Check: 90 + 32 + last = 180`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `58°`,
                  work: `180 − 90 = 90, then 90 − 32 = 58. Check: 90 + 32 + 58 = 180.`,
                  plain: `The right angle takes half the runway. The two sharp corners split the other half, and 32 plus 58 makes 90.`
                }
              }
            ]
          },

          /* ============---- MODULE 8 ============---- */
          {
            id: 8,
            title: `3D Volume and Spatial Capacity`,
            book: `Singapore Math 5B, Volume`,
            bc: `Volume of rectangular prisms, capacity and the link between cubic centimeters and liters.`,
            kidSummary: `Fill a whole room with cubes and learn how much space it really holds.`,
            bigIdea: {
              title: `The 3D Space Explorer Cubes`,
              hook: `You are a space explorer with a bag of tiny cubes. Your mission is to measure a room three different ways: the fence around it, the floor inside it, and the space all the way up to the ceiling.`,
              steps: [
                {
                  stage: `Concrete`,
                  heading: `Fence, mats and blocks`,
                  story: `Explorer job one is the fence. The perimeter is the distance around the edge of a flat shape, like walking all the way around a garden. It is measured in plain units, like meters. Explorer job two is the floor mats. The area is how many flat square mats it takes to cover the floor. It is measured in square units, like square meters. Explorer job three is stacking blocks. The volume is how many cubes fill the whole room from the floor up to the high ceiling. It is measured in cubic units, like cubic meters, written m³. A cube that is 1 meter on every side is 1 cubic meter.`,
                  plain: `Perimeter is a fence and only measures a line. Area is a floor and measures a flat surface. Volume is a full room and measures the space inside.`,
                  visual: {
                    type: `table`,
                    caption: `Three ways to measure`,
                    headers: [`What it measures`, `Unit`],
                    rows: [
                      { label: `Perimeter`, cells: [`the fence around`, `m`] },
                      { label: `Area`, cells: [`the floor mats`, `m²`] },
                      { label: `Volume`, cells: [`the blocks inside`, `m³`] }
                    ]
                  }
                },
                {
                  stage: `Pictorial`,
                  heading: `Build a box one layer at a time`,
                  story: `Imagine a box that is 4 cubes long, 3 cubes wide and 2 cubes tall. The floor layer has 4 × 3 cubes, which is 12 cubes. That is the floor area. The box is 2 layers tall, so you stack the floor layer 2 times. That makes 12 × 2, which is 24 cubes. The volume is 24 cubic units. Every layer is the same size as the floor, so the volume is just the floor area multiplied by the height.`,
                  plain: `Count one layer of cubes on the floor, then multiply by how many layers stack up.`,
                  visual: {
                    type: `pre`,
                    text: [
                      `Layer 1  4 × 3 = 12 cubes`,
                      `Layer 2  4 × 3 = 12 cubes`,
                      `Total    12 + 12 = 24 cubes`,
                      `Or       4 × 3 × 2 = 24`
                    ].join('\n')
                  }
                },
                {
                  stage: `Abstract`,
                  heading: `The volume formula and litre link`,
                  story: `The volume of a cuboid is length times width times height. We write V = L × W × H. Since L × W is the floor area, we can also write V = floor area × H. This gives us a trick for finding a missing measurement. To find the height, divide the volume by the floor area. Volume also tells us how much a container can hold, which is called capacity. A small cube that is 1 centimeter on every side is 1 cubic centimeter, written cm³. It takes 1,000 cubic centimeters to make 1 liter. So to change cubic centimeters into liters, divide by 1,000. For example, 5,000 cm³ ÷ 1,000 = 5 liters.`,
                  plain: `Multiply the three sides to fill the box. To go backward and find one side, divide the volume by the other measurements. A liter is a bottle that holds 1,000 tiny cubes.`,
                  visual: {
                    type: `pre`,
                    text: [
                      `Volume = Length × Width × Height`,
                      `Floor area = Length × Width`,
                      `Volume = Floor area × Height`,
                      `Height = Volume ÷ Floor area`,
                      `Liters = cm³ ÷ 1,000`
                    ].join('\n')
                  }
                }
              ],
              recap: `Volume is length times width times height, and to find a missing side you divide the volume by the sides you already know.`
            },
            quest: [
              {
                id: `m8q1`,
                type: `number`,
                keyboard: `numeric`,
                placeholder: `Type the volume in cubic meters`,
                skill: `Find the volume of a cuboid`,
                prompt: `A solid cuboid room is 5 meters long, 4 meters wide, and 3 meters tall. What is its total volume in cubic meters?`,
                answer: `60`,
                traps: [
                  { value: `12`, say: `You added 5 + 4 + 3. To fill a room with cubes, you multiply the three measurements instead of adding them.` },
                  { value: `20`, say: `That is 5 × 4, which is the floor area. You also need to multiply by the height of 3 meters to stack the layers up to the ceiling.` },
                  { value: `24`, say: `That is 4 × 3 × 2. Check that you used the right numbers: length 5, width 4 and height 3.` }
                ],
                hint: {
                  nudge: `Volume = Length × Width × Height. Multiply all three numbers.`,
                  steps: [
                    `Write down the formula: Volume = Length × Width × Height.`,
                    `Put in the numbers: Length is 5, Width is 4 and Height is 3.`,
                    `Multiply the length and width first to find the floor area: 5 × 4 = ?`,
                    `Then multiply the floor area by the height. The unit is cubic meters, written m³.`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      `Volume = L × W × H`,
                      `       = 5 × 4 × 3`,
                      `Floor area = 5 × 4 = ?`,
                      `Volume = ? × 3 = ?`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `60 cubic meters`,
                  work: `5 × 4 = 20 square meters of floor. 20 × 3 = 60 cubic meters.`,
                  plain: `The floor takes 20 cubes to cover. The room is 3 layers tall, so you need 3 layers of 20, which is 60 cubes.`
                }
              },
              {
                id: `m8q2`,
                type: `number`,
                keyboard: `decimal`,
                placeholder: `Type the number of liters`,
                skill: `Convert cubic centimeters to liters`,
                prompt: `A rectangular tank holding 12,000 cubic centimeters of water is emptied. How many liters of liquid capacity does that equal? (Hint: 1,000 cubic centimeters = 1 liter.)`,
                answer: `12`,
                traps: [
                  { value: `12000`, say: `That is the number of cubic centimeters you started with. You still need to change it into liters.` },
                  { value: `120`, say: `You divided by 100. It takes 1,000 cubic centimeters to make 1 liter, so divide by 1,000.` },
                  { value: `1.2`, say: `You divided by 10,000. It takes 1,000 cubic centimeters to make 1 liter, so divide by 1,000.` }
                ],
                hint: {
                  nudge: `Every 1,000 cubic centimeters makes 1 liter. Ask how many groups of 1,000 fit into 12,000.`,
                  steps: [
                    `Write the link: 1 liter = 1,000 cm³.`,
                    `To find the liters, divide the cubic centimeters by 1,000.`,
                    `Divide 12,000 by 1,000. A quick way is to cross out three zeros from both numbers.`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      `1 liter = 1,000 cm³`,
                      `Liters = cm³ ÷ 1,000`,
                      `       = 12,000 ÷ 1,000 = ?`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `12 liters`,
                  work: `12,000 ÷ 1,000 = 12.`,
                  plain: `A liter bottle holds 1,000 tiny cubes. 12,000 tiny cubes fill 12 of those bottles.`
                }
              },
              {
                id: `m8q3`,
                type: `number`,
                keyboard: `decimal`,
                placeholder: `Type the height in meters`,
                skill: `Find a missing dimension from volume`,
                prompt: `A cuboid container has a known volume of 60 cubic meters. Its floor area is 20 square meters (Length × Width). How tall is the container?`,
                answer: `3`,
                traps: [
                  { value: `80`, say: `You added 60 and 20. To go backward from a multiplication, divide instead.` },
                  { value: `1200`, say: `You multiplied. But volume is already the floor area times the height, so to find the height you divide.` },
                  { value: `40`, say: `You subtracted. Volume comes from multiplying, so undo it by dividing.` }
                ],
                hint: {
                  nudge: `Volume = Floor area × Height. To find the height, divide the volume by the floor area.`,
                  steps: [
                    `Start with the formula: Volume = Length × Width × Height.`,
                    `Length × Width is the floor area, so Volume = Floor area × Height.`,
                    `You know the volume and the floor area. To find Height, divide: Height = Volume ÷ Floor area.`,
                    `Check your answer by multiplying: Floor area × Height should give you the volume of 60.`
                  ],
                  visual: {
                    type: `pre`,
                    text: [
                      `Volume = Floor area × Height`,
                      `60     = 20 × ?`,
                      `Height = 60 ÷ 20 = ?`
                    ].join('\n')
                  }
                },
                solution: {
                  answer: `3 meters`,
                  work: `Height = 60 ÷ 20 = 3. Check: 20 × 3 = 60.`,
                  plain: `The floor holds one layer of 20 cubes. To reach 60 cubes you need 3 layers, so the box is 3 meters tall.`
                }
              }
            ]
          }
];

/* Which BC strand each module belongs to, and whether the calculator unlocks.
   extra: true means the topic comes from Singapore Math and is not in the BC Grade 5 outline. */
window.MATH_META = {
  1: { strand: 'number', calc: false, extra: false },
  2: { strand: 'operations', calc: false, extra: false },
  3: { strand: 'challenge', calc: false, extra: true },
  4: { strand: 'number', calc: false, extra: false },
  5: { strand: 'challenge', calc: true, extra: true },
  6: { strand: 'challenge', calc: true, extra: true },
  7: { strand: 'challenge', calc: true, extra: true },
  8: { strand: 'challenge', calc: true, extra: true }
};
window.MATH_MODULES.forEach(function (m) { Object.assign(m, window.MATH_META[m.id]); });


/* ---- Pass 2: BC strand modules. Lessons, vocabulary and questions live in js/m9.js to js/m21.js ---- */
window.MATH_MODULES = window.MATH_MODULES.concat([
  { id: 9, title: 'Equivalent Fractions and Benchmarks', book: 'Method: Concrete, Pictorial, Abstract', bc: 'Compare and order fractions, find equivalent fractions, and use benchmarks such as 0, 1/2 and 1.', kidSummary: 'Place fractions on a number line, use 0, one half and 1 as benchmarks, and switch between mixed numbers and improper fractions.' },
  { id: 10, title: 'Multiplication and Division Facts', book: 'Method: Concrete, Pictorial, Abstract', bc: 'Recall multiplication facts to 12 × 12 and the related division facts. Use fact families and strategies.', kidSummary: 'Get quick and confident with times tables and the division facts that go with them.' },
  { id: 11, title: 'Estimating Answers', book: 'Method: Concrete, Pictorial, Abstract', bc: 'Estimate sums, differences, products and quotients by rounding and using compatible numbers.', kidSummary: 'Use friendly numbers to make a smart guess, then check if an answer makes sense.' },
  { id: 12, title: 'Number Patterns and Tables', book: 'Method: Concrete, Pictorial, Abstract', bc: 'Describe, extend and create increasing and decreasing patterns using tables and rules.', kidSummary: 'Find the rule in a pattern, fill in a table and predict what comes next.' },
  { id: 13, title: 'One Step Equations', book: 'Method: Concrete, Pictorial, Abstract', bc: 'Solve one step equations with a letter for the unknown, using whole numbers and the inverse operation.', kidSummary: 'Solve for the mystery number using a balance and undo moves.' },
  { id: 14, title: 'Area and Perimeter', book: 'Method: Concrete, Pictorial, Abstract', bc: 'Find area and perimeter of rectangles, squares and combined shapes. Find missing sides.', kidSummary: 'Measure the space inside a shape and the distance around it.' },
  { id: 15, title: 'Elapsed Time', book: 'Method: Concrete, Pictorial, Abstract', bc: 'Read times, use 12 hour and 24 hour clocks, and calculate elapsed time and convert time units.', kidSummary: 'Work out how long something takes and when it ends, on 12 hour and 24 hour clocks.' },
  { id: 16, title: '2D Shapes and 3D Solids', book: 'Method: Concrete, Pictorial, Abstract', bc: 'Describe polygons, triangles, quadrilaterals, and 3D solids by faces, edges and vertices. Lines of symmetry.', kidSummary: 'Name shapes, count their sides and corners, and learn how flat shapes fold into solids.' },
  { id: 17, title: 'Slides, Flips and Turns', book: 'Method: Concrete, Pictorial, Abstract', bc: 'Perform and describe single transformations: translations, reflections and rotations, using the first quadrant grid.', kidSummary: 'Move shapes on a grid using ordered pairs, then flip and turn them.' },
  { id: 18, title: 'Graphs and Tables', book: 'Method: Concrete, Pictorial, Abstract', bc: 'Read and compare data in tables, bar graphs, double bar graphs, pictographs with scales and line graphs.', kidSummary: 'Read bar graphs, pictographs and tables and answer questions about the data.' },
  { id: 19, title: 'Chance and Probability', book: 'Method: Concrete, Pictorial, Abstract', bc: 'Describe likelihood, find probabilities of simple events as fractions, and compare predictions to results.', kidSummary: 'Describe how likely something is with words and fractions, and test it with spinners, dice and coins.' },
  { id: 20, title: 'Making Change', book: 'Method: Concrete, Pictorial, Abstract', bc: 'Add prices, make change from bills and coins, count up, and round cash totals to the nearest 5 cents.', kidSummary: 'Count up to make change and add up prices using Canadian money.' },
  { id: 21, title: 'Budgets and Smart Spending', book: 'Method: Concrete, Pictorial, Abstract', bc: 'Create simple budgets, separate needs and wants, plan savings goals, and compare unit prices.', kidSummary: 'Plan how to earn, spend and save, and compare prices to find the best deal.' }
]);
Object.assign(window.MATH_META, {
  9: { strand: 'number', calc: false, extra: false },
  10: { strand: 'operations', calc: false, extra: false },
  11: { strand: 'operations', calc: false, extra: false },
  12: { strand: 'patterns', calc: false, extra: false },
  13: { strand: 'patterns', calc: false, extra: false },
  14: { strand: 'measurement', calc: true, extra: false },
  15: { strand: 'measurement', calc: false, extra: false },
  16: { strand: 'geometry', calc: false, extra: false },
  17: { strand: 'geometry', calc: false, extra: false },
  18: { strand: 'data', calc: true, extra: false },
  19: { strand: 'data', calc: false, extra: false },
  20: { strand: 'money', calc: true, extra: false },
  21: { strand: 'money', calc: true, extra: false }
});
window.MATH_MODULES.forEach(function (m) { if (m.id > 8) Object.assign(m, window.MATH_META[m.id]); });

/* The BC Grade 5 map. A topic is either a module id (m) or a coming soon title (soon). */
window.MATH_STRANDS = [
  { id: 'number', name: 'Number Sense', blurb: 'Big numbers, decimals and fractions.', badge: 'bg-indigo-700 text-white', border: 'border-indigo-500',
    topics: [ { m: 1 }, { m: 4 }, { m: 9 } ] },
  { id: 'operations', name: 'Operations and Fluency', blurb: 'Adding, taking away, times and sharing.', badge: 'bg-emerald-600 text-white', border: 'border-emerald-500',
    topics: [ { m: 2 }, { m: 10 }, { m: 11 } ] },
  { id: 'patterns', name: 'Patterns and Equations', blurb: 'Find the rule and solve for the mystery number.', badge: 'bg-amber-500 text-slate-900', border: 'border-amber-500',
    topics: [ { m: 12 }, { m: 13 } ] },
  { id: 'measurement', name: 'Measurement', blurb: 'Area, perimeter, time and money.', badge: 'bg-sky-600 text-white', border: 'border-sky-500',
    topics: [ { m: 14 }, { m: 15 } ] },
  { id: 'geometry', name: 'Geometry', blurb: 'Shapes, solids and how they move.', badge: 'bg-rose-600 text-white', border: 'border-rose-500',
    topics: [ { m: 16 }, { m: 17 } ] },
  { id: 'data', name: 'Data and Probability', blurb: 'Read graphs and guess what happens next.', badge: 'bg-teal-600 text-white', border: 'border-teal-500',
    topics: [ { m: 18 }, { m: 19 } ] },
  { id: 'money', name: 'Money Smart', blurb: 'Change, budgets and saving.', badge: 'bg-lime-600 text-white', border: 'border-lime-600',
    topics: [ { m: 20 }, { m: 21 } ] },
  { id: 'challenge', name: 'Singapore Challenge', blurb: 'Extra puzzles from Singapore Math. Not required for BC Grade 5, but great practice.', badge: 'bg-violet-700 text-white', border: 'border-violet-500',
    topics: [ { m: 3 }, { m: 5 }, { m: 6 }, { m: 7 }, { m: 8 } ] }
];
