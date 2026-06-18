# PRD Template — JGVRP In-Game Tools

*Copy this file for each new tool/feature. Replace the bracketed placeholders. Each section's "Example" block shows how it would look filled in for a sample tool — a Dynamic Vehicle Impound & Towing System — so you can see the level of detail expected.*

---

## 0. Document Info

| Field | Value |
|---|---|
| Tool/Feature Name | `JGVRP ARMS DEALER CALCULATOR` |
| Author | `bimaak15/Leshawn Patterson` |
| Date | `2026-06-18` |
| Status | `In Dev` |
| Version | `v0.1` |
| Reviewers | `Personal` |

**Example:**
| Field | Value |
|---|---|
| Tool/Feature Name | Dynamic Vehicle Impound & Towing System |
| Author | Budi |
| Date | 2026-06-18 |
| Status | Draft |
| Version | v0.1 |
| Reviewers | Lead Dev (Rian), Head Admin (Sasha) |

---

## 1. Overview / Summary

> The Arms Dealer Profit Calculator is a utility tool designed for JGVRP players who operate within the Arms Dealer role. The tool automatically calculates weapon production costs, ammunition costs, total manufacturing expenses, selling prices, and estimated profit based on the player's inputs. Currently, these calculations are commonly performed manually through spreadsheets, which can be time-consuming and prone to errors during large transactions. This tool centralizes the entire profit calculation process into a single interface, allowing players to make faster business decisions, accurately determine profit margins, and reduce mistakes when producing and selling weapons in-game.

---

## 2. Background / Problem Statement

> Arms Dealer players currently rely on manual calculations or personal spreadsheets to determine weapon production costs and expected profit from weapon sales. Each transaction involves multiple variables, including gun materials, heavy materials, components, ammunition costs, weapon quantities, and negotiated selling prices. As transaction sizes grow, these calculations become increasingly time-consuming and prone to human error.

Because there is no centralized profit calculation tool, players often struggle to quickly determine whether a deal is profitable before committing to production or sales. Incorrect calculations can lead to financial losses, inconsistent pricing strategies, and unnecessary delays during business operations. Additionally, different players frequently use their own spreadsheets and formulas, creating inconsistencies in how production costs and profits are calculated across the Arms Dealer community.

The lack of a dedicated calculation tool creates unnecessary friction in the Arms Dealer gameplay loop, where players should be focusing on business decisions and roleplay interactions rather than repeatedly performing complex manual calculations.

---

## 3. Goals & Success Metrics

- Reduce the time required to calculate weapon production costs and profit margins from several minutes of manual spreadsheet calculations to less than 30 seconds per transaction. 
- Eliminate common calculation errors in Arms Dealer transactions by automatically calculating production costs, ammunition costs, total expenses, and expected profit using a standardized formula.
- Achieve adoption by at least 80% of active Arms Dealer players, replacing the need for personal spreadsheets and manual profit calculations.
- Allow players to instantly evaluate the profitability of a weapon sale before production or negotiation, reducing decision-making time during business operations by at least 50%.

---

## 4. Non-Goals / Out of Scope  

- This tool will not automate weapon production, weapon sales, or any in-game actions. It only provides cost and profit calculations based on user inputs.
- No integration with JGVRP game servers, player accounts, inventories, or databases in v1. All values must be entered manually by the user.
- The tool will not provide market price recommendations, demand analysis, or trading advice. Users remain responsible for determining selling prices and negotiating deals.
- Inventory management, material tracking, and transaction history are out of scope for v1. The tool focuses solely on calculating production costs, ammunition costs, and estimated profit for a single transaction.
- Support for other illegal business calculations (e.g., drugs, vehicle theft, or other criminal activities) is not included in this version and may be considered as separate tools in the future.

---

## 5. Target Users / Roles

x

---

## 6. User Stories / Use Cases

> The primary audience for this tool is Arms Dealer players. While other roles may reference the calculations for balancing or verification purposes, the user experience and feature set are specifically designed around helping Arms Dealers quickly evaluate production costs and profit margins during weapon-related business activities.

---

## 7. Functional Requirements

**Must-have:**

* Input fields for weapon production variables, including weapon type, quantity, material costs, component costs, heavy material costs, ammunition costs, and selling price.
* Automatic calculation of total weapon production cost based on the provided inputs and predefined formulas.
* Automatic calculation of ammunition/clip production costs.
* Automatic calculation of total transaction cost by combining weapon and ammunition expenses.
* Real-time profit calculation showing expected profit or loss based on the entered selling price.
* Clear breakdown of all calculation components so users can understand how the final profit value is produced.
* Validation to prevent invalid inputs such as negative values or empty required fields.

**Should-have:**

* Preset weapon templates that automatically populate common production values for supported weapon types.
* Profit margin (%) calculation in addition to raw profit amount.
* Currency formatting for all monetary values to improve readability.
* Copy/export calculation results for sharing with buyers or faction members.
* Responsive layout supporting both desktop and mobile browsers.

**Nice-to-have:**

* Save calculation history for future reference.
* Comparison mode allowing users to compare multiple selling prices before making a deal.
* Dark mode and UI customization options.
* Economic analytics showing trends in profitability across different weapon types.
* Integration with future JGVRP business calculation tools through a shared dashboard.

---

## 8. Game Design & Balance Considerations

* **Economy impact:** This tool does not create, remove, or transfer any in-game currency. It functions purely as a calculation utility that helps Arms Dealer players accurately estimate production costs, ammunition costs, and expected profit before completing a transaction. As a result, the tool has no direct impact on the server economy, though it may encourage more informed pricing decisions and reduce accidental underpricing or overpricing.

* **RP realism:** Arms Dealers are expected to manage production costs, negotiate prices, and operate weapon businesses as part of their roleplay. The calculator supports this gameplay loop by reducing repetitive manual calculations while still requiring players to make their own business decisions and negotiations.

* **Abuse vectors:** Players may intentionally enter incorrect values or manipulate inputs to justify unrealistic prices during negotiations. This is considered a player-driven issue rather than a system exploit, as the tool only performs calculations based on the values provided by the user and does not enforce market prices.

* **Fairness:** The calculator is available to all players and does not provide exclusive economic advantages beyond reducing calculation time and human error. Any player can achieve the same results through manual calculations, ensuring the tool improves convenience without creating unfair gameplay advantages.

* **Balance philosophy:** The tool is designed to assist decision-making rather than automate gameplay. Players must still gather materials, produce weapons, negotiate deals, and manage business risks manually. The calculator simply provides transparency into the financial outcome of a transaction.

---

## 9. Technical Requirements

* **Client-side:** Web-based calculator interface built with HTML, CSS, and JavaScript. All calculations are performed locally in the browser to provide instant results without requiring server communication. The interface should support both desktop and mobile browsers for accessibility during gameplay.

* **Calculation Engine:** All production cost, ammunition cost, total expense, and profit calculations are handled through client-side JavaScript using predefined formulas based on the current Arms Dealer balancing values. Calculation results should update immediately whenever input values are changed.

* **Data Management:** No database is required for v1. All calculation data exists only within the user's current browser session and is discarded when the page is closed or refreshed.

* **Performance:** Calculations must execute instantly with no noticeable delay. The tool should maintain responsive performance even when calculating large transaction quantities or multiple weapon types. Target calculation time is under 100ms per update.

* **Validation:** Input validation must prevent negative values, empty required fields, invalid numerical formats, and unrealistic quantities that could produce incorrect calculations.

* **Future Integration:** The calculation logic should be modular and maintainable to support future integration with JGVRP-related tools, saved presets, transaction history, or centralized user accounts without requiring a complete system rewrite.

* **Compatibility:** The tool should function correctly on modern Chromium-based browsers, Firefox, and mobile browsers commonly used by JGVRP players.

* **Security:** Since no player account data, server data, or sensitive information is stored or transmitted, the application operates entirely client-side and does not require authentication in v1.

---

## 10. UI/UX Requirements

![UI/UX Mockup](./assets/JGVRP%20UI%20UX.png)

* **Main Calculator Screen:** Primary interface containing all weapon transaction inputs, including weapon type, quantity, material costs, component costs, heavy material costs, ammunition costs, and selling price. Inputs should be organized into clear sections to reduce user confusion.

* **Live Calculation Panel:** A dedicated results section that automatically updates whenever the user changes an input value. Displays total production cost, total ammunition cost, total transaction cost, expected profit/loss, and profit margin percentage.

* **Cost Breakdown View:** Users should be able to see how the final calculation is generated, including individual material costs, ammunition costs, and other contributing expenses. This improves transparency and allows players to verify calculations.

* **Empty State:** When no values have been entered, the calculator should display placeholder values (e.g., "$0" or "-") and a message encouraging the user to enter transaction details.

* **Validation/Error State:** Invalid inputs such as negative numbers, empty required fields, or non-numeric values should display a clear validation message. The calculator should prevent calculation errors and guide the user to correct the input.

* **Profit Status Indicator:** Profit values should be visually differentiated based on outcome:

  * Positive profit → success indicator.
  * Break-even transaction → neutral indicator.
  * Negative profit/loss → warning indicator.

* **Responsive Layout:** The interface must remain usable on desktop and mobile browsers, ensuring that players can access the calculator while playing JGVRP.

* **Result Sharing State (Future):** Calculation results may be copied or exported for sharing with faction members, business partners, or buyers without requiring screenshots.

* **Design Consistency:** The UI should prioritize readability and fast data entry, using a clean dashboard-style layout with clearly separated input and output sections. Visual clutter should be minimized to support frequent use during active gameplay.


---

## 11. Dependencies

*What other systems, tools, or people does this rely on? Flag anything not yet built.*

**Example:**
- Depends on existing **Vehicle Ownership** module (to verify owner before allowing retrieval).
- Depends on existing **Zone System** for no-park polygon definitions.
- Needs Lead Dev (Rian) to expose a hook in the **Economy API** for fee deduction.
- Needs Head Admin sign-off on fee amounts before launch (balance concern).

---

## 12. Testing Plan

* **Calculation Accuracy Test:** Verify all weapon production cost, ammunition cost, total expense, and profit calculations using multiple manually calculated test cases. Results generated by the tool must match expected values with 100% accuracy.

* **Input Validation Test:** Test negative numbers, empty fields, non-numeric values, decimal values, and extremely large quantities to ensure the system properly validates input and prevents invalid calculations.

* **Cross-Browser Test:** Verify functionality and UI consistency across Chromium-based browsers, Firefox, and mobile browsers to ensure all users receive identical calculation results.

* **Performance Test:** Perform rapid input changes and large transaction calculations to confirm that calculation results update instantly without noticeable lag. Target response time is under 100ms per update.

* **Responsive Layout Test:** Verify that all calculator functions remain accessible and readable on desktop, tablet, and mobile screen sizes.

* **User Acceptance Test (UAT):** Have multiple active Arms Dealer players use the calculator during simulated weapon transactions and provide feedback on usability, clarity, and calculation accuracy.

* **Workflow Test:** Simulate a complete Arms Dealer transaction flow (determine production costs → calculate ammunition costs → set selling price → review expected profit) to ensure the tool supports real gameplay scenarios without requiring external calculations.

* **Edge Case Test:** Verify behavior when profit equals zero (break-even), when selling prices are lower than production costs (loss scenario), and when transaction values are unusually high. The system should continue displaying accurate results without errors.

* **Formula Regression Test:** Whenever server balancing values or production formulas are updated, re-test all calculation formulas to ensure previous functionality remains accurate and no unintended calculation changes are introduced.

* **RP Practicality Test:** Confirm that players can obtain a complete profit calculation within 30 seconds during a typical Arms Dealer negotiation, reducing the need for spreadsheets, calculators, or manual calculations.

---

## 13. Rollout Plan

* **Phase 1: Internal Development & Verification**

  * Complete the initial calculator implementation and verify all production cost, ammunition cost, and profit formulas against existing spreadsheet calculations.
  * Conduct internal testing using multiple transaction scenarios to ensure calculation accuracy.

* **Phase 2: Closed Testing**

  * Share the tool with a small group of trusted Arms Dealer players for real-world testing.
  * Collect feedback on usability, calculation accuracy, missing features, and workflow efficiency.
  * Compare tool-generated results against manual spreadsheet calculations to identify discrepancies.

* **Phase 3: Public Release (v1)**

  * Deploy the calculator publicly and make it available to all JGVRP players.
  * Announce the release through Discord and relevant community channels.
  * Monitor bug reports, calculation issues, and user feedback during the first week after launch.

* **Phase 4: Post-Launch Improvements**

  * Address reported bugs and calculation inconsistencies.
  * Evaluate requests for additional features such as presets, calculation history, export functionality, or support for other business activities.
  * Continue updating formulas when server balancing values change.

* **Rollback Plan**

  * If a critical calculation error is discovered, temporarily disable public access to the calculator or display a maintenance notice while formulas are reviewed.
  * Revert to the previous verified calculation version if a newly released update produces incorrect profit calculations.
  * Maintain a backup copy of all calculation formulas and previous releases to allow rapid recovery from deployment issues.


---

## 14. Risks & Mitigations

| Risk                                                                   | Mitigation                                                                                                                                        |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Incorrect profit calculations due to formula bugs                      | Validate all formulas against existing spreadsheet calculations before release and perform regression testing after every update.                 |
| Server balancing changes make calculator values outdated               | Store formulas and balancing values in a centralized configuration so updates can be applied quickly when JGVRP economy changes occur.            |
| Users enter incorrect values and receive misleading profit estimates   | Implement input validation, clear field descriptions, and calculation breakdowns so users can verify all entered values before using the results. |
| Calculator becomes the "source of truth" even when values are outdated | Display the current calculator version and last balancing update date to help users identify whether the data is still accurate.                  |
| Future updates accidentally break existing calculations                | Maintain versioned releases and perform formula regression testing before deploying new updates.                                                  |
| Mobile users experience poor usability due to limited screen space     | Design a responsive layout and conduct testing across common mobile screen sizes before public release.                                           |
| Players rely solely on calculated profit and ignore market conditions  | Clearly communicate that the tool provides cost and profit estimates only and does not guarantee actual profitability or market demand.           |
| Browser compatibility issues cause inconsistent results                | Test calculations and UI behavior across multiple modern browsers before public deployment.                                                       |
| Loss of user trust caused by inaccurate calculations                   | Provide transparent cost breakdowns and allow users to manually verify every calculation step generated by the tool.                              |
| Community feature requests significantly expand project scope          | Maintain a defined product scope for v1 and evaluate additional features separately through future releases.                                      |

---
