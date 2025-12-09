<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h6">Rental Rules</div>
        <div class="text-caption">Spaceport RV Park — Mojave, California</div>
      </div>
      <div class="col-auto row q-gutter-sm">
        <q-btn flat icon="print" label="Print" @click="printPage" />
      </div>
    </div>

    <q-card flat bordered class="q-pa-md">
      <q-separator />

      <q-card-section>
        <div class="text-subtitle1">Rules and Regulations</div>
        <div class="text-body2 q-gutter-y-sm">
          <p><b>Rent:</b> Rent is due and payable on the first day of each month unless prior arrangements have been made with Management. Failure to comply will result in a late fee of $35.00 on the sixth (6th) day of the month and/or lawful termination of tenancy.</p>

          <p><b>Moving and Parking of Mobilehomes:</b> Mobilehomes will be parked and moved or removed only by an authorized moving contractor with approval of Owner and Manager upon request of the tenant. Moves shall occur under favorable weather conditions mutually agreed upon. No mobilehome may enter or leave without clearance from Management.</p>

          <p><b>Utility Connections:</b> Mobilehomes will be connected and disconnected by an authorized moving contractor, utility company representative, or by Management to meet City ordinances. Owner and/or Manager shall not be liable for any damage occasioned by failure to keep such premises in repair, or from plumbing fixtures on or about the premises. No utilities may be extended outside the resident's mobilehome without written consent of Management. All extensions must conform to applicable codes and ordinances.</p>

          <p><b>Liability:</b> Owners and Managers are not liable for damages or injuries to a tenant or family or their property from whatever cause arising from occupancy of the premises.</p>

          <p><b>Entry and Inspection:</b> Owner and/or Manager has the right to enter, after 24-hour notice, to inspect premises to ensure maintenance and safety. In an emergency, Owner and/or Manager may enter without prior notice.</p>

          <p><b>Quiet Enjoyment:</b> Lessee shall not commit or permit waste, nor commit any act which may disturb the quiet enjoyment of any other tenant or person on the property. Lessee will respect the rights and property of all other tenants and will not cause suffering to any other tenant.</p>

          <p><b>Conduct:</b> If any lessee is intoxicated, abusive, threatens or molests any tenant, Owner, Managers, or guests, the police will be called and lawful action will be taken.</p>

          <p><b>Installation Necessities (within 30 days of occupancy):</b></p>
          <ul>
            <li>Front porch or steps (kept painted and free of rust).</li>
            <li>Metal or vinyl skirting (other types subject to Management approval).</li>
            <li>Hitches removed, concealed, or painted to match exterior.</li>
            <li>All wheels pulled and mobilehome set as close to the ground as possible.</li>
            <li>Anchors: all mobilehomes must be anchored according to law.</li>
          </ul>

          <p><b>Premises Care:</b> Lessee shall keep the premises clean and sanitary, inside and out, at all times. Furniture, appliances, or household items must be stored in a shed or storage facility; items may not be stacked around the mobilehome or trailer.</p>

          <p><b>Trash:</b> Tenants will not burn trash or any items within the Park (barbecue grills excepted, used safely).</p>

          <p><b>Occupancy:</b> Premises shall not be occupied by persons not listed on the rental agreement without prior written permission of Management. Premises are leased for the personal residence of the named Lessee only.</p>

          <p><b>Guests:</b> Lessee is responsible for guest conduct. All Park Rules must be obeyed; violators may be asked to leave or escorted off by police.</p>

          <p><b>Children:</b> Children may not play in common areas without adult supervision. Common areas include all areas outside the door (except small private yards). Toys, bikes, etc., may not be left in common areas. Do not allow climbing trees or playing in bushes/plants or decorative foliage. Children must not disturb others' quiet enjoyment or play on another tenant's space without permission. Children may not play at property entrances/exits. You are responsible for your children at all times.</p>

          <p><b>Pets:</b> Written permission required. Two pets allowed (dogs or cats), each under 20 lbs at full growth. If a pet causes disturbance (barking, snarling, annoyance, danger), permission will be revoked. Pets may not invade any space, flower beds, shrubs, or common areas. Droppings must be picked up, wrapped, and placed in trash.</p>

          <p><b>Vehicles:</b> Vehicles must be parked alongside your coach. No parking in other spaces, occupied or not. Riding of motorcycles, motor bikes, motorized bicycles, or recreational vehicles in the Park is prohibited except for entrance/exit.</p>

          <p><b>Vehicle Work/Washing:</b> Not permitted at any time.</p>

          <p><b>Speed Limit:</b> 5 mph. Observe strictly for safety of children and animals.</p>

          <p><b>Office Messages:</b> The Park office will not take phone calls or deliver messages except in extreme emergencies.</p>

          <p><b>Laundry:</b> Clotheslines from one mobilehome to another or across yards are not permitted. Use the shared laundry considerately: monitor time, remove clothes promptly, report machine issues to the office, and clean up after use.</p>

          <p><b>Selling Mobilehome:</b> If mobilehome is to be removed, notify the Park office. Tenants may sell their mobilehome and have it remain in the Park only after notifying the Park office of intent to sell; prospective buyers must apply with the office and arrange deposits, etc. Upon sale, privately owned trailers or mobilehomes must be moved from the Park unless rental arrangements have been made with Management.</p>

          <p><b>Weapons:</b> Weapons shall not be discharged in the Park (including air rifles, BB guns, etc.). Knives used to intimidate or cause harm are prohibited. Violations are subject to immediate eviction and possible criminal prosecution.</p>

          <p><b>Complaints:</b> Complaints must be in writing and signed. A copy will be filed and the original sent to the person complained against. Three separate complaints from more than one source are grounds for eviction.</p>

          <p><b>Rule Changes:</b> Management reserves the right to modify, amend, delete, or change Park Rules and Regulations at any time as permitted by law.</p>

          <p><b>Security Deposit:</b> Refunded only when sixty (60) days' advance written notice of intent to vacate is given by tenant. Manager may withhold amounts necessary to recover unpaid rent and/or restore the mobilehome space to its initial condition, normal wear and tear excepted. Security deposits may not be used as last month's rent.</p>

          <div>
            <div class="text-subtitle2 q-mt-md">Arbitration of Disputes</div>
            <p>Any dispute or claim arising out of this contract or any resulting transaction shall be decided by neutral binding arbitration in accordance with the rules of the American Arbitration Association, and not by court action, except as provided by California law for judicial review of arbitration proceedings. Judgment upon the award may be entered in any court of jurisdiction. The parties shall have the right to discovery per Code of Civil Procedure 1283.05. Exclusions: (a) foreclosure or action to enforce a deed of trust/mortgage/real property sales contract (Civil Code 2985); (b) unlawful detainer; (c) filing/enforcement of a mechanic's lien; (d) matters within probate or small claims; (e) actions for bodily injury or wrongful death, or latent/patent defects under CCP 337.2 or 337.15. Filing judicial actions for provisional remedies (lis pendens, attachment, receivership, injunction) does not waive arbitration.</p>
            <p class="text-caption">Notice: By signing you agree to have disputes under this provision decided by neutral arbitration as provided by California law, and you give up rights to litigate such disputes in court or jury trial, and certain judicial rights to discovery and appeal unless included in this provision.</p>
          </div>

          <p><b>Acknowledgment:</b> By signing this agreement, tenant acknowledges inspection of the space to be rented and Park facilities, finds them as represented, and agrees to abide by all Rules and Regulations. Tenant further acknowledges the Park is a Drug-Free Zone and that he/she is not a registered sex offender.</p>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-subtitle1">Acknowledgment and Acceptance</div>
        <div class="text-body2">
          By signing below, Resident acknowledges receipt of these Rules and Regulations and agrees to comply with them as a condition of tenancy.
        </div>
        <div class="text-body2 q-mt-sm">
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
