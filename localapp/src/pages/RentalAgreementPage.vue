<template>
	<q-page class="q-pa-md">
		<div class="row items-center q-mb-md">
			<div class="col">
				<div class="text-h6">Rental Agreement</div>
				<div class="text-caption">Spaceport RV Park — Mojave, California</div>
			</div>
			<div class="col-auto row q-gutter-sm">
				<q-btn flat icon="print" label="Print" @click="printPage" />
			</div>
		</div>

		<q-card flat bordered class="q-pa-md">
			<q-card-section>
				<div class="text-body1">
					This rental agreement (hereinafter referred to as "Agreement") is executed on this <u>&nbsp;&nbsp;&nbsp;&nbsp;</u> day of <u>&nbsp;&nbsp;&nbsp;&nbsp;</u>, <u>&nbsp;&nbsp;&nbsp;&nbsp;</u>, between Spaceport RV Park (hereinafter referred to as "Park" or "Manager") and the undersigned Residents (hereinafter collectively referred to as "Resident"). Resident agrees to lease space number <u>&nbsp;&nbsp;&nbsp;&nbsp;</u> (the "Space") in the Park for the purpose of his residence and no other use.
				</div>
			</q-card-section>

			<q-separator />

			<q-card-section>
				<div class="text-subtitle1">1. Term</div>
				<div class="text-body2">
					The tenancy shall commence on the <u>&nbsp;&nbsp;&nbsp;&nbsp;</u> day of <u>&nbsp;&nbsp;&nbsp;&nbsp;</u>, <u>&nbsp;&nbsp;&nbsp;&nbsp;</u>, and continue month-to-month unless terminated as provided herein and by applicable law.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">2. Rent</div>
				<div class="text-body2">
					Resident agrees to pay to Park, as base rent for the Space, the sum of $<u>&nbsp;&nbsp;&nbsp;&nbsp;</u> per month. Park may, upon at least ninety (90) days' written notice of service, increase the monthly rent as provided by state law.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">3. Security Deposit</div>
				<div class="text-body2">
					A security deposit in the amount of $<u>&nbsp;&nbsp;&nbsp;&nbsp;</u> has been retained by Park. The Security Deposit will be refunded only when sixty (60) days' advance written notice of intent to vacate is given by Resident and as provided by state law. Manager may withhold from the Security Deposit such amounts as may be necessary to recover any unpaid rent and/or to restore the Space to the condition at the commencement of the tenancy, normal wear and tear excepted. Security Deposits may not be used as the last month's rent.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">4. Utilities</div>
				<div class="text-body2">
					In addition to base rent, Resident agrees to pay, on the first day following billing, the charges at prevailing rates for utilities furnished to Resident, including water, natural gas, electricity, garbage pickup, and sewer. Park reserves the right to separately bill for sewer service at any time as allowed by law.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">5. Facilities</div>
				<div class="text-body2">
					Streets and limited parking areas will be provided by Park during the term of this Agreement unless modified or changed as provided by law.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">6. Services</div>
				<div class="text-body2">
					Management services will be provided by Park during the term of this Agreement unless modified or changed as provided by law.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">7. Payment of Rent and Late Charges</div>
				<div class="text-body2">
					Payment of rent is due on the first day of each month without setoff, counterclaim, or deduction whatsoever. As additional rent, a late charge of $35.00 will be imposed if rent is not paid by the 5th of the month. This charge does not relieve Resident of the obligation to pay rent by the first of the month and is levied to cover costs of additional accounting. There will be a $15.00 handling charge for all checks dishonored by Resident's bank for any reason.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">8. Mobilehome Residency Law</div>
				<div class="text-body2">
					Attached, marked "Exhibit A" and by this reference made a part of this Agreement, as though set forth in full at this place, is a copy of the current Mobilehome Residency Law. By signing this Agreement, Resident acknowledges receipt of that law.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">9. Rules and Regulations</div>
				<div class="text-body2">
					Attached hereto and marked "Exhibit B," and by this reference made a part of this Agreement as though set forth in full at this place, is a copy of the present Rules and Regulations of the Park. Resident agrees to comply with all such Rules and Regulations and such additional rules and regulations as may be promulgated from time to time in accordance with state law. By signing this Agreement, Resident acknowledges receipt of those Rules and Regulations.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">10. Park Responsibility</div>
				<div class="text-body2">
					It is the responsibility of the Park to provide and maintain the physical improvements set forth above and the common areas in good working order and condition, and to continue to provide the services set forth above during the term of this tenancy. Heating and cooling of any recreational facilities depend upon the availability of natural resources and cannot be guaranteed; Park will conform to all demands or requests by government and public utility corporations to conserve energy.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">11. Amendments to Rules</div>
				<div class="text-body2">
					Rules and Regulations may be amended at any time with Resident's written consent. If Resident does not consent, amendment shall take place six (6) months after written notice of the change, as provided by law.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">12. Entry and Utilities; Maintenance</div>
				<div class="text-body2">
					Management may enter the Space as permitted by law to maintain utilities or in case of emergency. If Resident fails to maintain the Space in accordance with Park Rules and Regulations after written notice, and fails to comply within fourteen (14) days, the tenancy may be terminated as provided by law.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">13. Termination of Tenancy</div>
				<div class="text-body2">
					Resident may terminate the tenancy upon written notice not less than sixty (60) days prior to vacating. Park may terminate the tenancy in accordance with the provisions of the Mobilehome Residency Law.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">14. Removal on Sale</div>
				<div class="text-body2">
					Resident may resell his mobilehome. However, the Park may, at its option, exercise rights under the Mobilehome Residency Law to require removal of the mobilehome upon resale to a third party, as set forth in the Rules and Regulations.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">15. Assignment or Subletting</div>
				<div class="text-body2">
					Resident shall not assign, sublet, or rent his mobilehome or homesite in the Park without prior written Park approval. Park may require information and background checks on any proposed assignee or sublessee. Any approved subletting shall constitute a new tenancy.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">16. Use Prohibited</div>
				<div class="text-body2">
					Resident shall not use or permit the Space to be used for any purpose other than a residence for the persons listed below. No person may make the Space his permanent residence without prior written consent of the Park; consent may be granted or withheld in Park's sole discretion based on availability of facilities and occupancy limits.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">17. Fixtures</div>
				<div class="text-body2">
					Fixtures including plants, shrubs, trees, and structures embedded in the ground shall become the property of the Park and shall not be removed by Resident without prior written consent. Resident shall maintain such items during the term of tenancy.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">18. Holding Over</div>
				<div class="text-body2">
					Any holding over by Resident with the consent of Park shall be deemed a month-to-month tenancy on the same terms and conditions.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">19. Service of Notices</div>
				<div class="text-body2">
					Notices shall be served as provided by law, including Section 1162 of the California Code of Civil Procedure. Resident agrees that notices such as rent increase, rules changes, or meeting notices may be mailed first-class, postage prepaid, to Resident's Park address, and deemed served as of the postmark date.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">20. Waiver</div>
				<div class="text-body2">
					No waiver by Park of any breach shall be deemed a waiver of any subsequent breach. Acceptance of rent shall not waive prior breaches other than failure to pay the particular rent accepted.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">21. Waiver of Liability</div>
				<div class="text-body2">
					Park is not liable for damage caused by acts or negligence of other residents or guests. Resident shall pay for damages caused by Resident or Resident's family or guests to the Park, Space, or others, except for damage arising from Park's negligence or willful misconduct.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">22. Attorney's Fees and Court Costs</div>
				<div class="text-body2">
					In any action to recover rent or utilities due, enforce this Agreement or Rules, recover possession, or interpret this Agreement, the prevailing party shall be entitled to reasonable attorney's fees and costs as fixed by the court, including costs of serving any required notice.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">23. Time is of the Essence</div>
				<div class="text-body2">
					Time is of the essence of this Agreement.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">24. Severability</div>
				<div class="text-body2">
					Each provision of this Agreement is separate; if any provision is declared unenforceable, it shall not affect the enforceability of the remaining provisions.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">25. Inspection of Premises and Approval</div>
				<div class="text-body2">
					Resident acknowledges he has inspected the Space and Park facilities and found them to be as represented. If Resident believes there is a deficiency in common areas or utility systems, Resident agrees to notify Park in writing, specifying the deficiency. Park shall investigate and, if necessary, remedy within forty-five (45) days or notify Resident of findings and remedial status, per Civil Code §798.15(b).
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">26. Arbitration of Disputes (Common Area/Utilities Deficiencies)</div>
				<div class="text-body2">
					If, after Park's response under §25(c), a dispute remains regarding alleged deficiencies described in §25(b), either party may require arbitration per Title 9 of Part 3 of the California Code of Civil Procedure. The parties shall each appoint one arbitrator; those two shall appoint a third, or the Presiding Judge of Kern County Superior Court shall appoint the third if they cannot agree. The panel's decision is final and binding between the parties to the arbitration. Costs shall be borne equally, payable upon demand. Arbitrable issues shall proceed to completion before judicial action on non-arbitrable issues, subject to statutory exceptions.
				</div>
				<div class="text-caption q-mt-sm">
					Notice: By initialing below you agree to have disputes concerning the matters included in this provision decided by neutral arbitration and you are giving up any rights to litigate those matters in court or jury trial, as permitted by law.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">27. Captions, Gender, Number</div>
				<div class="text-body2">
					Captions are for convenience only. Gender and number shall be interpreted as required by context.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">28. Indemnification</div>
				<div class="text-body2">
					Resident agrees to indemnify and hold Park harmless from liability for occurrences on the premises under Resident's control or arising from Resident's activities, except for damage or injury arising from Park's negligence or willful misconduct.
				</div>
			</q-card-section>

			<q-card-section>
				<div class="text-subtitle1">29. Entire Agreement</div>
				<div class="text-body2">
					This Agreement contains the entire agreement between the parties. No promise or representation not included herein has been relied upon. Failure to inspect or obtain advice constitutes a waiver of objections based on such. This Agreement and its exhibits shall be deemed written by both parties.
				</div>
			</q-card-section>

			<q-separator />

			<q-card-section>
				<div class="text-subtitle1">Execution</div>
				<div class="text-body2">
					Executed this <u>&nbsp;&nbsp;&nbsp;&nbsp;</u> day of <u>&nbsp;&nbsp;&nbsp;&nbsp;</u>, <u>&nbsp;&nbsp;&nbsp;&nbsp;</u> at Mojave, California.
				</div>
				<div class="row q-col-gutter-md q-mt-md">
					<div class="col-12 col-md-6">
						<div class="text-caption">Resident</div>
						<div class="sig-line"></div>
					</div>
					<div class="col-12 col-md-6">
						<div class="text-caption">Resident</div>
						<div class="sig-line"></div>
					</div>
					<div class="col-12 col-md-6 q-mt-sm">
						<div class="text-caption">Spaceport RV Park — Manager</div>
						<div class="sig-line"></div>
					</div>
				</div>
			</q-card-section>
		</q-card>
	</q-page>
</template>

<script setup>
function printPage() {
	window.print()
}
</script>

<style scoped>
.sig-line { border-bottom: 1px solid #999; height: 28px; }
@media print {
	.q-btn { display: none; }
	.q-page { padding: 0; }
}
</style>




