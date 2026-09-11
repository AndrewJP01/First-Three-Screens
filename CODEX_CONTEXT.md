# CraveSave Project Context for Codex

Read this document before making changes to the project.

## Project summary

CraveSave is a small, interactive prototype for a website that helps budget-conscious college students and young adults compare restaurant deals based on the type of food they are craving.

The central promise is:

> Tell us what food you want, and we will help you compare the available deals.

The fundamental value is **confidence**. Users should be able to decide where to eat knowing they compared the relevant offers instead of wondering whether they missed a better deal.

This is a class prototype, not a production deal-scraping service. All restaurant promotions are mock content and must be clearly presented as prototype examples.

## Required scope

The assignment is deliberately limited to three screens:

1. **Landing / Food Search**
   - Immediately explain that users can search for food and compare restaurant deals.
   - Include a prominent food search field.
   - Allow the user to search for or select **Burgers**.

2. **Burger Deal Results**
   - Show believable mock offers from multiple restaurants.
   - Make each restaurant, offer, restriction, value, and action easy to scan as one grouped card.

3. **Deal Details**
   - Explain what the selected offer includes.
   - Show its price, restrictions, redemption steps, and example availability.
   - Include a clear **Get Deal** action.

Do not add login, account creation, profiles, favorites, settings, restaurant-management tools, a database, or a backend unless the assignment requirements change.

## Current implementation

The initial version is complete and working.

Current interaction flow:

1. The user enters a food craving or clicks the **Burgers** quick-select button.
2. The interface changes to the Burger Deal Results screen.
3. Selecting **View deal** changes the interface to the Deal Details screen.
4. Back controls allow users to return to the results or landing screen.
5. The **Get deal** button currently displays a prototype-completion message instead of opening a real restaurant app.

The prototype is implemented as one client-side page with React state rather than three separate URL routes. The screen state is:

```ts
type Screen = "home" | "results" | "details";
```

Changing this architecture is unnecessary unless a future requirement specifically calls for separate routes.

## Current mock deals

- Burger King — $5 Whopper Meal
- McDonald’s — 20% off an order of $12+
- Wendy’s — Free fries with a qualifying purchase
- Sonic — Half-price cheeseburger after 5 p.m.

All deal cards currently lead to the same Burger King detail example because only one detail screen is required for the prototype.

## Technical stack

- React 19
- TypeScript
- Next.js 16 using the Vinext/Vite toolchain
- Tailwind CSS 4
- Shadcn-style interface components already included in `components/ui`
- Lucide React icons
- pnpm

Expected local environment:

- Node.js 22.13 or newer
- pnpm 11

Common commands:

```bash
pnpm install
pnpm dev
pnpm build
```

Do not replace the existing package manager, framework configuration, or lockfile without a concrete reason.

## Important files

- `app/page.tsx` — all three screens, mock deal data, state, and interactions
- `app/globals.css` — theme tokens and global styles
- `app/layout.tsx` — page metadata and shared layout
- `components/ui/button.tsx` — shared button primitive
- `components/ui/input.tsx` — shared input primitive
- `public/burger-hero.png` — original landing-page burger image
- `public/favicon.svg` — CraveSave favicon
- `README.md` — local setup and GitHub instructions

## Current visual direction

The design should remain:

- Clean, modern, and friendly
- Mobile-friendly and easy to scan
- Appropriate for college students and young adults
- Focused on comparison and decision-making rather than decorative content

Current visual language:

- Deep navy for trust and structure
- Bright blue for interactive elements
- Yellow as a restrained savings/value accent
- White deal cards with clear borders and common-region grouping
- Large, high-contrast typography on the landing screen
- One food image as the main visual anchor

Maintain a consistent visual language across all three screens. Do not introduce an unrelated color palette or generic dashboard styling.

## Design priorities

Before adding polish, check these questions:

1. Can a first-time user understand within five seconds that the site finds restaurant deals based on what they want to eat?
2. Can users compare restaurants, offers, qualifications, and value without opening every deal?
3. Can users understand exactly what the selected offer includes and how it would be redeemed?
4. Do proximity, similarity, and common region clearly communicate which information belongs together?
5. Does the interface make users feel confident that they have compared their relevant options?

Secondary controls must not compete with the main craving-to-deal flow.

## Accessibility and responsive behavior

Preserve or improve the following:

- Semantic buttons, forms, headings, lists, and articles
- Visible keyboard focus states
- Descriptive labels and accessible button names
- Automatic focus movement to the main heading when screens change
- Readable text and touch-friendly controls
- Mobile layouts without horizontal scrolling or clipped content
- Reduced-motion support

## Known prototype limitations

- The deals are static mock data.
- Search terms other than burgers still display the burger results prototype.
- The filter buttons change their selected appearance but do not reorder the mock deals.
- Every deal card opens the same required detail example.
- The Get Deal button does not leave the prototype.
- There is no live location, restaurant API, coupon verification, account system, persistence, or backend.

These are intentional prototype boundaries, not bugs, unless a future task asks to change them.

## Instructions for future Codex work

When asked to revise this project:

1. Inspect the existing implementation before editing.
2. Preserve the three-screen scope unless explicitly told otherwise.
3. Make the smallest coherent change that satisfies the request.
4. Keep mock-deal disclaimers visible and do not imply that offers are verified or live.
5. Reuse the existing Button and Input components instead of creating duplicate primitives.
6. Keep responsive behavior and accessibility intact.
7. Run `pnpm build` after meaningful code changes and fix any build errors.
8. Summarize the files changed and the visible effect of the revision.

## Next assignment step

The initial version has been completed. The assignment now requires at least one **meaningful design revision** related to communication, signaling, grouping, or comprehension.

Wait for the user to identify the desired revision, then help implement and evaluate it. Do not invent extra product features simply to make the prototype appear more complete.
