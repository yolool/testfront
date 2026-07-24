# TODO: Fix Responsive PDF Generation

## Problem
When generating PDFs, `html2canvas` captures the DOM as displayed on screen. On mobile/tablet, responsive CSS shrinks layout elements, causing PDF to look different from the PC version.

## Plan
Clone the content into an **off-screen container with fixed 210mm width** before capturing with `html2canvas`, ensuring consistent A4-proportioned capture regardless of viewport size.

## Steps
- [x] Step 1: Read and analyze all relevant files
- [x] Step 2: Get user approval on the plan
- [x] Step 3: Edit `src/app/engagement-form/engagement-form.component.ts` - Off-screen A4 container fix
- [x] Step 4: Edit `src/app/engagement-impartiality/engagement-impartiality.component.ts` - Off-screen A4 container fix
- [x] Step 5: Verify the build compiles successfully ✅

