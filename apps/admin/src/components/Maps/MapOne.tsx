
import { useState } from "react"
import WorldMap from "react-svg-worldmap"
import { BsFilter, BsCalendar } from "react-icons/bs"

interface NGOData {
  name: string
  coordinates: [number, number]
  ngos: number
  projects: number
  type: "local" | "international"
  workplan: WorkplanData
}

interface WorkplanData {
  communityHealing: number
  socialReintegration: number
  socialCohesion: number
}

const ngoData: Record<string, NGOData> = {
  RW: {
    name: "Rwanda",
    coordinates: [-1.9403, 29.8739],
    ngos: 15,
    projects: 25,
    type: "local",
    workplan: {
      communityHealing: 80,
      socialReintegration: 75,
      socialCohesion: 85,
    },
  },
  KE: {
    name: "Kenya",
    coordinates: [-0.0236, 37.9062],
    ngos: 5,
    projects: 8,
    type: "local",
    workplan: {
      communityHealing: 70,
      socialReintegration: 65,
      socialCohesion: 75,
    },
  },
  UG: {
    name: "Uganda",
    coordinates: [1.3733, 32.2903],
    ngos: 3,
    projects: 5,
    type: "local",
    workplan: {
      communityHealing: 60,
      socialReintegration: 55,
      socialCohesion: 65,
    },
  },
  US: {
    name: "United States",
    coordinates: [37.0902, -95.7129],
    ngos: 8,
    projects: 12,
    type: "international",
    workplan: {
      communityHealing: 90,
      socialReintegration: 85,
      socialCohesion: 95,
    },
  },
  GB: {
    name: "United Kingdom",
    coordinates: [55.3781, -3.436],
    ngos: 6,
    projects: 9,
    type: "international",
    workplan: {
      communityHealing: 85,
      socialReintegration: 80,
      socialCohesion: 90,
    },
  },
  FR: {
    name: "France",
    coordinates: [46.2276, 2.2137],
    ngos: 4,
    projects: 6,
    type: "international",
    workplan: {
      communityHealing: 75,
      socialReintegration: 70,
      socialCohesion: 80,
    },
  },
  DE: {
    name: "Germany",
    coordinates: [51.1657, 10.4515],
    ngos: 5,
    projects: 7,
    type: "international",
    workplan: {
      communityHealing: 80,
      socialReintegration: 75,
      socialCohesion: 85,
    },
  },
}

const MapOne = () => {
  const [dateRange, setDateRange] = useState("year")
  const [ngoType, setNgoType] = useState("all")
  const [selectedIndicator, setSelectedIndicator] = useState("all")
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  // Filter NGO data based on selected filters
  const filteredData = Object.entries(ngoData).filter(([_, data]) => {
    if (ngoType !== "all" && data.type !== ngoType) return false
    if (selectedIndicator !== "all") {
      const indicatorValue = data.workplan[selectedIndicator as keyof WorkplanData]
      return indicatorValue > 70 // Example threshold, adjust as needed
    }
    return true
  })

  // Convert filtered NGO data to format expected by WorldMap
  const mapData = filteredData.map(([code, data]) => ({
    country: code,
    value: data.ngos,
    coordinates: data.coordinates,
    type: data.type,
  }))

  const handleCountryClick = (countryCode: string) => {
    setSelectedCountry(countryCode)
  }

  return (
      <div className="flex min-h-screen flex-col space-y-6 bg-white p-8">
        <h1 className="text-4xl font-bold">NGO World Map</h1>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 shadow-sm">
            <BsCalendar className="h-4 w-4 text-gray-500" />
            <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent pr-8 text-sm focus:outline-none"
            >
              <option value="all">All Time</option>
              <option value="year">Past Year</option>
              <option value="month">Past Month</option>
              <option value="week">Past Week</option>
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 shadow-sm">
            <BsFilter className="h-4 w-4 text-gray-500" />
            <select
                value={ngoType}
                onChange={(e) => setNgoType(e.target.value)}
                className="bg-transparent pr-8 text-sm focus:outline-none"
            >
              <option value="all">All NGOs</option>
              <option value="local">Local NGOs</option>
              <option value="international">International NGOs</option>
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 shadow-sm">
            <BsFilter className="h-4 w-4 text-gray-500" />
            <select
                value={selectedIndicator}
                onChange={(e) => setSelectedIndicator(e.target.value)}
                className="bg-transparent pr-8 text-sm focus:outline-none"
            >
              <option value="all">All Indicators</option>
              <option value="communityHealing">Community Healing</option>
              <option value="socialReintegration">Social Reintegration</option>
              <option value="socialCohesion">Social Cohesion</option>
            </select>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg bg-gray-50 shadow-md">
          {/* Map Background */}
          <div className="absolute inset-0 bg-[#f8fafc]">
            <WorldMap
                color="#e2e8f0"
                size="responsive"
                data={mapData}
                strokeOpacity={1}
                backgroundColor="#f8fafc"
                valueSuffix="NGOs"
                styleFunction={(context: any) => {
                  const countryCode = context.country || context.countryCode
                  const isActive = mapData.some((item) => item.country === countryCode)

                  return {
                    fill: isActive ? "#e2e8f0" : "#f1f5f9",
                    stroke: "#cbd5e1",
                    strokeWidth: 0.5,
                    cursor: "pointer",
                  }
                }}
                onClickFunction={(_, countryCode) => handleCountryClick(countryCode)}
            />
          </div>

          {/* Custom Markers */}
          {mapData.map((item, index) => (
              <div
                  key={index}
                  className={`
                      absolute h-4 w-4 rounded-full shadow-lg transition-transform hover:scale-125
                      ${item.type === "international" ? "bg-blue-400" : "bg-black"}`
                  }
                  style={{
                    left: `${((item.coordinates[1] + 180) / 360) * 100}%`,
                    top: `${((90 - item.coordinates[0]) / 180) * 100}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={() => handleCountryClick(item.country)}
              >
                {/* Pulse Effect */}
                <span
                    className={`
                        absolute -inset-1 animate-ping rounded-full opacity-75
                        
                        ${item.type === "international" ? "bg-blue-400" : "bg-black"} `
                    }
                />
              </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="relative h-4 w-4">
              <div className="h-4 w-4 rounded-full bg-black" />
            </div>
            <span className="text-sm text-gray-600">Local NGOs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative h-4 w-4">
              <div className="h-4 w-4 rounded-full bg-blue-400" />
            </div>
            <span className="text-sm text-gray-600">International NGOs</span>
          </div>
        </div>

        {/* Workplan Modal */}
        {selectedCountry && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-2xl font-bold">{ngoData[selectedCountry].name} Workplan</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Community Healing</h3>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div
                          className="h-2 bg-green-500 rounded-full"
                          style={{ width: `${ngoData[selectedCountry].workplan.communityHealing}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{ngoData[selectedCountry].workplan.communityHealing}%</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Social Reintegration</h3>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${ngoData[selectedCountry].workplan.socialReintegration}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{ngoData[selectedCountry].workplan.socialReintegration}%</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Social Cohesion</h3>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div
                          className="h-2 bg-purple-500 rounded-full"
                          style={{ width: `${ngoData[selectedCountry].workplan.socialCohesion}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{ngoData[selectedCountry].workplan.socialCohesion}%</span>
                  </div>
                </div>
                <button
                    className="mt-6 w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    onClick={() => setSelectedCountry(null)}
                >
                  Close
                </button>
              </div>
            </div>
        )}
      </div>
  )
}

export default MapOne

