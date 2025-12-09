<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h6">Disaster Plan Requirements</div>
      </div>
      <div class="col-auto row q-gutter-sm">
        <q-btn flat icon="print" label="Print" @click="printPage" />
      </div>
    </div>



    <!-- Structured content container -->
    <div class="q-gutter-md">
      <q-card flat bordered>
        <q-card-section>
          <div class="text-body1 q-gutter-y-sm">
            <p><b>Dear Tenants:</b></p>
            <p>
              Pursuant to Health and Safety Code sections 18603 and 18871.8, mobilehome parks are required to create an emergency preparedness plan. The plan for our park is located in the manager’s office and/or residence. Please see the manager if you have questions.
            </p>
            <p>
              It is the intent of the Legislature that an owner or operator of a mobilehome park or manufactured home community communicate to residents essential evacuation routes and basic emergency preparedness information in a manner appropriate to the community.
            </p>
            <p>
              It is not the intent of the Legislature that an owner or operator be responsible for physically evacuating residents or take personal custody of residents during an emergency. Residents are expected to take personal responsibility for themselves during an emergency.
            </p>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1">Spaceport RV Park</div>
          <div class="text-body2">
            2121 Nadeau Street, Mojave, CA 93501
          </div>
          <div class="text-body2 q-mt-xs">
            <b>Emergency Contacts:</b> Barbara Parker — (661) 824-2811 (Park), (831) 373-3013 (Office)
          </div>
          <div class="text-caption q-mt-xs">Park ID#: J20 • Elevation: 2,801 ft • Local emergency broadcast: KERN 1180 • Updated: 02/21/2011</div>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1">Common Disasters</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <ul class="text-body2">
                <li>Fire</li>
                <li>Flood</li>
                <li>Earthquakes</li>
                <li>Tornado (rare)</li>
              </ul>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1">Utility Shutoffs</div>
          <ul class="text-body2">
            <li>Main electric disconnects are located in the north and south laundry rooms.</li>
            <li>Main water shutoffs are at spaces A5 and H5.</li>
            <li>Main gas shutoffs are at the back of the spaces with gas service.</li>
            <li>Each space electric disconnect is located at the rear right corner of the space.</li>
          </ul>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1">Checklist of Emergency Procedures</div>
          <ul class="text-body2 q-gutter-y-xs">
            <li>Meet with your family and discuss preparedness; plan to assist those who may need help.</li>
            <li>Draw a floor plan and mark two escape routes from each room.</li>
            <li>Install and maintain smoke detectors and fire extinguishers.</li>
            <li>Discuss evacuation procedures and safe spots for each disaster type.</li>
            <li>Post emergency phone numbers; teach how and when to call 9-1-1.</li>
            <li>Designate one out-of-state and one local contact to reconnect if separated.</li>
            <li>Pick two meeting places: near home (fire) and outside neighborhood (wider emergency).</li>
            <li>Keep family records in a water- and fire-proof container.</li>
            <li>Locate and learn how to shut off electricity, water, and gas; keep tools nearby.</li>
            <li>Take basic first aid and CPR classes; prepare a disaster supply kit.</li>
          </ul>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1">If Disaster Strikes</div>
          <ul class="text-body2 q-gutter-y-xs">
            <li>Remain calm; check for injuries; provide first aid to the seriously injured.</li>
            <li>Listen to a battery-powered radio for news and instructions.</li>
            <li>Evacuate if advised; wear sturdy shoes and appropriate clothing.</li>
            <li>Use a flashlight to check your home; avoid matches or electrical switches if damage is suspected.</li>
            <li>If you smell gas, turn off the main valve, open windows, and exit quickly.</li>
            <li>Shut off damaged utilities; clean up spilled flammables and hazardous materials.</li>
            <li>Secure pets; call your family contact; check on neighbors; avoid downed power lines.</li>
          </ul>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1">Earthquake Safety</div>
          <div class="text-body2">
            Preplan safe areas and know where piers/supports are under manufactured homes. Ensure installation follows manufacturer instructions and state regulations.
          </div>
          <ul class="text-body2 q-mt-sm">
            <li>Indoors: take cover under sturdy furniture or in a doorway; stay away from windows and fixtures.</li>
            <li>Use only battery-powered lights and radios; avoid matches and electrical equipment.</li>
            <li>Outdoors: move to open areas away from power lines, tall buildings, bridges, and trees.</li>
            <li>Confine pets; expect aftershocks.</li>
          </ul>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1">Fire Safety</div>
          <ul class="text-body2 q-gutter-y-xs">
            <li>Maintain smoke detectors and extinguishers; replace batteries regularly.</li>
            <li>Plan and practice two escape routes; conduct fire drills.</li>
            <li>Maintain heating and electrical systems; follow appliance instructions and avoid overloading circuits.</li>
            <li>Keep matches, lighters, and candles from children; insure personal property; store important documents safely.</li>
          </ul>
          <div class="text-subtitle2 q-mt-md">In Case of Fire</div>
          <ul class="text-body2 q-gutter-y-xs">
            <li>Assess the fire location; use a fire extinguisher if trained; evacuate all people and pets.</li>
            <li>Call 9-1-1; provide park address, space number, and fire type; inform park office.</li>
            <li>Turn off gas and electricity if safe; alert nearby residents; never re-enter a burning home.</li>
            <li>If smoky: stay low; check doors for heat before opening. If clothing ignites: cover face, stop, drop, and roll.</li>
          </ul>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1">Flood Safety</div>
          <div class="text-caption">Flood Watch: possible flooding • Flood Warning: flooding imminent or occurring</div>
          <div class="text-subtitle2 q-mt-sm">Before a Flood</div>
          <ul class="text-body2 q-gutter-y-xs">
            <li>Know your elevation relative to waterways; plan multiple escape routes.</li>
            <li>Monitor NOAA and local broadcasts; move items to higher ground.</li>
            <li>Turn off electricity if time permits; cover outlets; prepare a disaster kit; secure LP gas tanks and water heaters.</li>
          </ul>
          <div class="text-subtitle2 q-mt-sm">During a Flood</div>
          <ul class="text-body2 q-gutter-y-xs">
            <li>Act immediately; move to higher ground; avoid flooded roads and barricades.</li>
            <li>Wear life preservers if possible; avoid contact with floodwater; take your disaster kit; lock your home.</li>
          </ul>
          <div class="text-subtitle2 q-mt-sm">After a Flood</div>
          <ul class="text-body2 q-gutter-y-xs">
            <li>Return only when authorities say it is safe; discard contaminated food; have electrical systems inspected before turning on.</li>
            <li>Manage cleanup safely; rest often; contact the American Red Cross for recovery guidance.</li>
          </ul>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1">Tornado Safety</div>
          <ul class="text-body2 q-gutter-y-xs">
            <li>Monitor weather alerts; know the difference between watch and warning.</li>
            <li>Plan safe locations (community clubhouse or relatives); leave manufactured homes during warnings.</li>
            <li>Carry a battery-powered radio and your disaster kit.</li>
          </ul>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1">First Aid</div>
          <div class="text-body2">Prepare a first aid kit and know basic procedures. Move injured only if they are in imminent danger.</div>
          <div class="text-subtitle2 q-mt-sm">Sample First Aid Kit</div>
          <ul class="text-body2 q-gutter-y-xs">
            <li>Bandages (assorted sizes), sterile gauze pads (2" and 4")</li>
            <li>Adhesive tape, roller bandages, triangle bandages</li>
            <li>Scissors, tweezers, needle, antiseptic, thermometer</li>
            <li>Towelettes, petroleum jelly, safety pins, cleansing agent/soap</li>
            <li>Latex gloves, sunscreen, aspirin</li>
            <li>Syrup of ipecac, activated charcoal (only if advised by Poison Control)</li>
          </ul>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1">Family Disaster Supplies Kit</div>
          <ul class="text-body2 q-gutter-y-xs">
            <li>Water (1 gallon per person per day) and purification method</li>
            <li>Ready-to-eat foods; specialty items for infants/elderly; comfort foods; vitamins</li>
            <li>Matches in waterproof container; backup fire-starting method</li>
            <li>Shelter items: tent, blankets/sleeping bags, reflective blanket</li>
            <li>Lighting: flashlights, extra batteries, light sticks, lantern</li>
            <li>Tools: pliers, hammer, screwdrivers, bolt cutters, utility knife, shovel, hatchet</li>
            <li>Rope, sewing kit, first aid supplies, radio and batteries, whistle</li>
            <li>Sanitation and personal comfort items; extra clothing and sturdy shoes</li>
            <li>Cash/travelers checks; can opener; fire extinguisher (ABC type)</li>
            <li>Important papers (copies); sun protection; compass; foil; signal flare; bleach</li>
            <li>Prescription medications; baby supplies; games/books/toys; spare contacts or glasses</li>
          </ul>
          <div class="text-caption q-mt-sm">Inspect kits twice a year; rotate food/water every 6 months; keep kits portable and near an exit.</div>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1">Pet Preparedness</div>
          <ul class="text-body2 q-gutter-y-xs">
            <li>Do not leave pets behind; identify shelters and pet-friendly lodging in advance.</li>
            <li>Pack a pet survival kit: food, water, meds, records, litter/pan, dishes, first aid, carrier/leash.</li>
            <li>Ensure ID tags are current; keep a recent photo; secure carriers/leashes to prevent escape.</li>
            <li>During disasters: bring pets inside; separate species; manage birds with covered cages.</li>
            <li>After disasters: keep pets leashed; watch behavior changes; avoid hazards like downed lines.</li>
          </ul>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1">Agency Contacts (Kern County & Bakersfield)</div>
          <ul class="text-body2 q-gutter-y-xs">
            <li>Emergency Services: 911</li>
            <li>Directory Services (health & human services): 211 (24/7)</li>
            <li>Kern County Administrative Center: 661-868-3140</li>
            <li>Kern County Fire Department: 661-391-7000 — www.kerncountyfire.org</li>
            <li>Kern County Sheriff: 661-861-3110 — www.kernsheriff.com • Mojave Substation (Doug Wilson): 661-824-7130, WilsonD@kernsheriff.com</li>
            <li>Kern Medical Center: 661-326-2000 — www.kernmedical.com</li>
            <li>County Animal Control: 661-868-7135 — www.kerncounty.com/acd</li>
            <li>County Behavioral Health (Crisis): 661-868-8000 — www.kernbhrs.org</li>
            <li>Kern County Dept. of Public Health: 661-868-0306 — www.kernpublichealth.com</li>
            <li>California Highway Patrol (Mojave): 661-824-2408</li>
            <li>Bakersfield Police Department: 661-327-7111</li>
            <li>Community Services District: 661-854-2127</li>
            <li>Cal OES (California Office of Emergency Services): 916-845-8510 — www.caloes.ca.gov</li>
          </ul>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
function printPage() {
  window.print()
}
</script>

<style scoped>
@media print {
  .q-btn { display: none; }
  .q-page { padding: 0; }
}
</style>
