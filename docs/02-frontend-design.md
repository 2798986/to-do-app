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
