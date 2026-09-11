# CraveSave

CraveSave is a prototype that helps budget-conscious college students and young adults find and compare restaurant deals based on the type of food they are craving at that moment.

**Affordance:** Search for the food you are craving to compare restaurant deals, prices, savings, and requirements in one place.

## 1. Need, Persona, Primary Capability, and Fundamental Value

**Need:** When college students and young adults know what type of food they want but are trying to spend less, finding the best deal requires spending limited time checking multiple restaurant apps, websites, and coupon offers individually.

**Persona:** Budget-conscious college students and young adults who eat out a few times per week, often decide where to eat based on price, and are willing to choose between several restaurants serving the same type of food.

**Primary Capability:** Search for a type of food and compare currently available restaurant deals, coupons, and promotions in one place.

**Fundamental Value — Confidence:** Users can quickly choose where to eat knowing they have compared available deals instead of wondering whether they are missing a better option.

## 2. Three Screens

### Landing / Food Search
**Job:** Immediately communicate that users can search for a food they are craving and compare restaurant deals.

**Why it earned a slot:** This establishes CraveSave's primary capability and fundamental value before the user begins searching.

**Design question:** After seeing this screen for five seconds, will users understand that CraveSave helps them compare restaurant deals based on what they want to eat?

![Final landing screen](assets/screenshots/after-landing.png)

### Burger Deal Results
**Job:** Let users compare offers from multiple restaurants without opening each deal individually.

**Why it earned a slot:** This is the primary capability in action. Users can compare what they get, the price or savings, and requirements across restaurants.

**Design question:** Can users quickly compare restaurant options and understand which deal fits their needs without opening every offer?

![Final burger deal results screen](assets/screenshots/after-results.png)

### Deal Details
**Job:** Explain exactly what a selected offer includes and how to redeem it.

**Why it earned a slot:** It completes the flow by turning a comparison into an actionable choice.

**Design question:** Can users quickly understand what the offer includes, its requirements, and what they need to do to redeem it?

![Final deal details screen](assets/screenshots/after-details.png)

## 3. Design Question Plan

| Area | Question | Prediction | Prototype basis |
| --- | --- | --- | --- |
| **Need** | Think about the last time you wanted to eat out but also wanted to save money. How did you decide where to go, and did you look for any deals first? | I predict users will say they checked one or two restaurant apps, searched online, or chose somewhere they already knew had a deal because checking every restaurant takes too much effort. | The results screen combines offers from several restaurants in one place, addressing the need to check restaurants individually. |
| **Value** | If you could see available deals from different restaurants all in one place, what would be most valuable about that to you? Why? | I predict users will mention saving money, saving time, or feeling confident that they found a good deal. | The results screen presents the offer, price or savings, and requirements together so users can compare before choosing. |
| **Persona** | How often are you deciding where to eat based on what deals or discounts you can find? What is usually going on when you're making that decision? | I predict this happens regularly for budget-conscious college students, especially when eating between classes, going out with friends, or wanting something quick without spending much. | The quick search and comparison flow is designed for fast, price-conscious eating decisions. |
| **Capability** | I'm going to show you the home screen for five seconds, then hide it. Tell me what you think this website does. | I predict users will say something similar to, "You search for what food you want and it shows you deals at different restaurants." | The landing headline, search field, and **Find deals** button directly communicate that capability. |

## 4. Design Justification and First Read

### Landing Screen
On first read, the revised landing screen clearly signals the primary capability through **"Compare restaurant deals for the food you crave."** The supporting line, **"Choose where to eat with confidence,"** connects that capability to the fundamental value of confidence.

Each major element earns its place. The headline explains what the product does, the supporting copy communicates the payoff, and the search field plus **Find deals** button provide the primary action. The burger image reinforces the food context, but its reduced size prevents it from competing with the search flow.

### Gestalt Grouping
The results screen uses **common region, proximity, and similarity**. Each restaurant's identity, offer, what the user gets, price or savings, requirements, and action are grouped within one card. Repeating the same structure across cards makes the offers easier to scan and compare.

The detail screen uses the same principles. What the user gets is grouped together, while price or savings, requirements, and availability are placed in their own common region. Redemption instructions are grouped separately under **How to get it** so users can understand the offer and its conditions before acting.

### Staying on Mission and Navigation
Screens 2 and 3 stay focused on the primary capability and value. The results screen supports comparison, and the details screen explains the selected offer and how to use it.

A visible **Home** link provides a direct route to the landing screen from all three screens. **New search** and **Back to burger deals** provide contextual navigation without distracting from the main flow.

### Other Important Revisions
On the landing screen, I changed **"What are you craving?"** to **"Compare restaurant deals for the food you crave."** This was motivated by the five-second capability question and makes the primary capability explicit at first glance.

I also reduced the image's visual prominence to improve **visual hierarchy** and added a visible **Home** link across all three screens to improve **navigation signaling**.

On the detail screen, I moved the offer information before the redemption instructions so users understand the deal and its conditions before acting.

These changes improve communication, grouping, signaling, navigation, and comprehension rather than simply changing the appearance.

## 5. Meaningful Revision: Before and After

The initial **Burger Deal Results** screen visually grouped each restaurant well, but its information architecture made different types of deals appear more directly comparable than they really were. A meal price, percentage discount, and free item all appeared under the same **"Deal Value"** label. This use of **similarity** made fundamentally different offers look like the same type of value.

### Before
![Initial burger deal results screen](assets/screenshots/before-results.png)

### After
![Revised burger deal results screen](assets/screenshots/after-results.png)

The revision replaced the generic **"Deal Value"** label with clearer descriptions of the type of price or savings and grouped each benefit with its requirements using **proximity** and **common region**. This makes different kinds of offers easier to understand and compare without implying that they are equivalent.

This revision was motivated by the design question: **Can users quickly compare restaurant options and understand which deal fits their needs without opening every offer?**
