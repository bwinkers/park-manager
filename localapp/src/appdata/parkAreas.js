// Source of truth for Park Areas used across the app
export function getParkAreaOptions() {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
  const southside = ['Building', 'Mensroom', 'Womensroom', 'Laundry']
    .map(s => `Southside ${s}`).sort((a, b) => collator.compare(a, b))
  const dumpsite = ['Dumpsite', 'Dumpsite Building', 'Dumpsite Mensroom', 'Dumpsite Womensroom', 'Dumpsite Laundry']
    .sort((a, b) => collator.compare(a, b))

  // General areas (services like CCTV/WiFi moved to Park Services)
  const generalBase = ['Entrance', 'North Dumpster', 'Fence', 'Parking lot', 'Yard', 'Flag', 'Security Garage']
  const generalSorted = generalBase.sort((a, b) => collator.compare(a, b))
  const idxNorth = generalSorted.indexOf('North Dumpster')
  const general = [...generalSorted]
  const insertPos = idxNorth >= 0 ? idxNorth + 1 : 0
  general.splice(insertPos, 0, 'Southside Dumpster')

  const flat = [...southside, ...dumpsite, ...general]
  return flat.map(v => ({ label: v, value: v }))
}
