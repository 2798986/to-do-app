# Frontend Design Skill — Distinctive, Usable Applications

## Purpose

Create a polished, coherent interface that is appropriate for the actual application. Avoid generic AI-generated styling and make deliberate decisions about colour, typography, layout, hierarchy and interaction.

The lecturer has specifically warned against defaulting to glassmorphism, excessive rounded corners, purple gradients and repetitive dashboard patterns.

This skill is a design process, not a fixed visual theme. Adapt it to the examination brief.

## Design principles

1. **Purpose before decoration:** The interface must make the application's main task obvious.
2. **Clarity before novelty:** Users should understand what to do without guessing.
3. **Consistency:** Reuse a small set of spacing, typography, colour and component rules.
4. **Hierarchy:** Make the most important information and action visually prominent.
5. **Restraint:** Avoid decorative effects that do not improve meaning or usability.
6. **Responsive behaviour:** The interface should remain usable at relevant screen sizes.
7. **Feedback:** Every important interaction should communicate its outcome.
8. **Accessibility:** Use readable contrast, semantic elements, labels and keyboard-friendly controls.

## Step 1 — Understand the product

Before designing, identify:
- Who will use the application?
- What is the primary task?
- What information matters most?
- What is the most important user journey?
- Is the product data-heavy, workflow-oriented, content-focused, creative, administrative or something else?
- What should users notice first?

Do not assume every application needs a dashboard, sidebar, cards or charts.

Choose a layout that follows the problem.

## Step 2 — Establish a visual direction

Choose two starting points:

### A. Colour direction

Select a restrained palette appropriate to the product. Define:
- Primary colour.
- Secondary or supporting colour.
- Background colour.
- Surface colour.
- Text colour.
- Muted text colour.
- Border colour.
- Success, warning and error colours.

Example palette directions (adapt as needed):

| Direction | Possible characteristics |
|---|---|
| Forest / natural | Deep green, warm off-white, muted sage |
| Professional / navy | Navy, cool white, slate |
| Editorial | Warm neutrals, strong typography, one accent |
| Monochrome | Charcoal, white, greys, restrained accent |
| Energetic | Strong but controlled accent, neutral foundations |

Do not use a palette simply because it looks attractive in isolation. Check contrast and suitability for the product.

### B. Architectural / visual style

Possible directions:
- **Modern editorial:** typography-led, generous whitespace, clear sections.
- **Minimal professional:** restrained colour, subtle borders, functional components.
- **Contemporary geometric:** structured grids, strong alignment and confident typography.
- **Data-centric:** information-dense but carefully organised tables, filters and visualisations.
- **Productivity-oriented:** clear task hierarchy, fast interactions and minimal distraction.

Use references for inspiration, not as templates to copy.

## Step 3 — Define design tokens

Create a small, consistent design system before building many screens.

Example CSS variables (adapt the values):

```css
:root {
  --color-primary: #24483f;
  --color-background: #f7f7f3;
  --color-surface: #ffffff;
  --color-text: #202522;
  --color-muted: #68716c;
  --color-border: #e1e5e1;
  --color-success: #287a50;
  --color-warning: #a96816;
  --color-danger: #b43d3d;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  --radius-small: 4px;
  --radius-medium: 8px;
}
```

These values are examples, not mandatory defaults. Avoid making every element heavily rounded.

## Step 4 — Plan the information architecture

Identify:
- Pages or views.
- Navigation.
- Main content regions.
- Primary and secondary actions.
- Forms and data displays.
- Empty, loading, success and error states.

Sketch the hierarchy before implementing the details.

For each screen, answer:
1. What is the screen for?
2. What should the user notice first?
3. What is the primary action?
4. What information is essential?
5. What happens when there is no data?
6. What happens when an action fails?

## Step 5 — Build reusable interface components

Create reusable components where they improve consistency, for example:
- Buttons.
- Form fields.
- Navigation items.
- Page headers.
- Tables.
- Status indicators.
- Dialogs or confirmation patterns.
- Alerts and feedback messages.

Do not build a component library for its own sake. Reuse patterns that genuinely recur.

## Step 6 — Interaction and state design

For every interactive element, define:
- Initial state.
- User action.
- Expected state change.
- Success feedback.
- Failure feedback.
- Loading behaviour, if relevant.

Forms should include:
- Clear labels.
- Appropriate input types.
- Validation.
- Helpful error messages.
- Submission feedback.
- Protection against accidental duplicate submissions where appropriate.

Destructive actions should be clear and, when appropriate, confirmed.

## Step 7 — Responsive design

At minimum, check:
- Wide desktop.
- Typical laptop.
- Narrow/mobile width if relevant to the use case.

Ensure:
- Navigation remains usable.
- Content does not overflow.
- Tables have an appropriate narrow-screen treatment.
- Forms remain usable.
- Buttons and controls are not cramped.
- Text remains readable.

Do not simply shrink the desktop layout. Adapt the information hierarchy.

## Step 8 — Visual quality review

After implementation, inspect the actual running application.

Check:
- Alignment.
- Spacing consistency.
- Typography hierarchy.
- Contrast and readability.
- Navigation clarity.
- Component consistency.
- Empty and error states.
- Responsiveness.
- Whether the interface feels appropriate to the product.

Remove unnecessary gradients, glass effects, shadows, pills and decorative cards if they weaken clarity.

## Instructions for the coding agent

When using this file as a Qoder skill:

- Read the examination brief before choosing the visual direction.
- If the user supplies design preferences or references, respect them.
- If no preference is supplied, choose a coherent direction and briefly explain it.
- Use the available frontend-design skill when available and permitted.
- Do not invent pages or features that are not justified by the requirements.
- Prioritise a complete, usable interface over decorative polish.
- Inspect the running application, not just the source code.
- Do not claim visual verification without actually viewing the rendered interface.

## Step 9 — Use an established component library when appropriate

A component library can improve consistency and reduce the amount of styling and interaction code that must be created from scratch. However, a library is only an advantage when it is suitable for the project and can be used confidently within the examination environment.

### Selection rules

1. First inspect the existing project, its dependencies and its established conventions.
2. If the project already uses a suitable component library, prefer using it consistently rather than introducing a second one.
3. If starting from scratch, consider a familiar, well-supported library that fits the chosen framework.
4. For React projects, shadcn/ui or Mantine may be suitable options, but they are examples rather than mandatory choices.
5. Choose a library only if its documentation and required packages are accessible through the examination environment, and installation/configuration can be completed reliably.
6. Do not spend valuable examination time learning an unfamiliar library. Use the framework's existing capabilities and straightforward CSS if that is the safer option.
7. Avoid adding multiple overlapping component libraries or dependencies for minor visual improvements.

A component library supplies building blocks; it does not make the design decisions for you. The overall layout, hierarchy, palette, typography, spacing and content still need deliberate direction.

## Step 10 — Establish project-level design rules for Qoder

Where Qoder supports project rules or persistent repository instructions, use them to keep design expectations consistent across features. First inspect the repository and the Qoder environment to identify the supported mechanism and location. Do not assume a particular rules filename or create several competing instruction files.

If project-level rules are unavailable, keep these instructions in this Markdown file and explicitly ask Qoder to follow them when planning and implementing the frontend.

The project rules should communicate the following expectations:

### Visual consistency
- Use one deliberate visual direction suited to the product.
- Define and consistently reuse a restrained colour palette with one clear accent colour unless the product has a strong reason to require more.
- Use a consistent typography system, preferably one primary font family with a small, intentional scale of sizes and weights.
- Use one spacing scale and consistent alignment rules.
- Keep borders, shadows and corner radii restrained and consistent.
- Avoid defaulting to purple gradients, glassmorphism, excessive rounded corners, oversized cards or centred layouts without a product-specific reason.
- Avoid making every section a separate card. Prefer clear page structure, headings, tables, lists and well-organised content regions where appropriate.

### Useful, information-rich interfaces
- Prefer dense, scannable layouts when the task involves managing, comparing or analysing information.
- Use tables and lists when they communicate structured information more clearly than large cards.
- Make important information easy to find without overwhelming the user.
- Use realistic, relevant sample data during development. Do not fill the interface with lorem ipsum, meaningless placeholder labels or repetitive fake records.
- Clearly distinguish sample/demo data from real persisted data where that distinction matters.

### Complete interface states
For every relevant view or data-driven component, consider and implement:
- Loading state: communicate that work is in progress.
- Empty state: explain what the absence of data means and, where useful, how to get started.
- Error state: explain what went wrong in useful language and provide a recovery action where possible.
- Success state: confirm that the user's action succeeded.
- Disabled or unavailable state: explain why an action cannot currently be used when that is not self-evident.

Do not add artificial loading delays or unnecessary states to static content that does not need them.

### Interaction quality
- Provide clear feedback after important actions, such as saving, updating, creating or deleting data. Toast notifications are appropriate when they are supported by the existing stack and do not replace important inline feedback.
- Validate user input and explain errors next to the relevant fields where practical.
- Prevent accidental duplicate submissions when appropriate.
- Use confirmation for consequential destructive actions. Provide undo or recovery where it is practical and safe; do not add complicated undo infrastructure for low-risk actions.
- Choose sensible defaults that reduce unnecessary user effort.
- Remember filters or preferences only when doing so is useful, predictable and proportionate to the requirements. Do not add persistence or settings complexity without a reason.
- Add keyboard shortcuts only for frequent, meaningful actions. Make shortcuts discoverable, avoid conflicts with browser and operating-system shortcuts, and ensure the application remains usable without them.
- Ensure interactive controls have clear labels, focus states and accessible keyboard behaviour.

These are quality expectations, not permission to invent features. Apply them in proportion to the product, requirements, risk and remaining time.

## Step 11 — Avoid fragile tooling and unnecessary setup

The examination environment may restrict websites, package registries, documentation domains, extension marketplaces or external services. A tool that works on a personal computer may not work in the examination lab.

Therefore:
- Do not make the application depend on an editor extension or external AI service.
- Do not assume that a package, font, icon set, image service or documentation website is reachable.
- Prefer dependencies already installed in the project or available through permitted package sources.
- Check availability before relying on a new dependency.
- If a dependency cannot be installed reliably, use a simpler available alternative.
- Avoid adding editor extensions or plugins during the examination unless explicitly permitted and clearly necessary.
- Keep the application functional if optional external assets or services are unavailable.

The design must be achievable with the tools and resources actually available in the examination environment.

## Step 12 — Distinguish design quality from visual decoration

A polished application is not necessarily an elaborate one. Quality comes from the fit between the interface and the task.

Before adding a visual effect or interaction, ask:
1. Does this make information easier to understand?
2. Does this make an important action easier to find or complete?
3. Does this improve feedback, accessibility or consistency?
4. Is the benefit worth the implementation and testing time?

If the answer is no, leave it out.

A simple, distinctive and reliable interface is preferable to a visually elaborate interface with incomplete functionality.

## Design review checklist

Before declaring the frontend complete, check:

- [ ] The visual direction suits the actual product and its users.
- [ ] The application does not look like an unmodified generic AI template.
- [ ] Colour, typography, spacing and component styles are consistent.
- [ ] The main task and primary action are immediately understandable.
- [ ] Information is presented using suitable layouts, tables or lists rather than cards by default.
- [ ] Sample content is realistic and relevant.
- [ ] Relevant loading, empty, error and success states are handled.
- [ ] Forms provide useful validation and feedback.
- [ ] Destructive actions are appropriately protected.
- [ ] Keyboard and focus behaviour are usable where relevant.
- [ ] The interface works at the screen sizes relevant to the use case.
- [ ] No unnecessary dependencies or external services have been introduced.
- [ ] The running application has been visually inspected.

