import { useEffect, useRef, useState } from "react"
import mapboxGl from "mapbox-gl"
import ArrowIcon from "../images/icon-arrow.svg"
import MarkerIcon from "../images/icon-location.svg"

export default function Main() {
    const [ipAddressInput, setIpAddressInput] = useState("192.212.174.101")
    const [ipAddress, setIpAddress] = useState("")
    const [location, setLocation] = useState("")
    const [timezone, setTimezone] = useState("")
    const [isp, setIsp] = useState("")
    //Mapbox
    mapboxGl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [lng, setLng] = useState("")
    const [lat, setLat] = useState("")

    function handleChange(e) {
        setIpAddressInput(e.target.value)
    }

    async function getData() {
        await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_IPIFY_API_KEY}&domain=${ipAddressInput}`)
            .then(res => res.json())
            .then(data => {
                setIpAddress(data.ip)
                setLocation(`${data.location.region}, ${data.location.country}`)
                setTimezone(`UTC ${data.location.timezone}`)
                setIsp(data.isp)
                setLng(data.location.lng)
                setLat(data.location.lat)
            })
            .catch(() => console.log("Something Went Wrong, Please Disable Conflicting Browser Extensions"))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        getData()
    }

    useEffect(() => {
        document.querySelector(".main--map").innerHTML = ""

        map.current = new mapboxGl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/light-v10",
            center: [lng, lat],
            zoom: 10
        })

        const markerIcon = document.createElement("img")
        markerIcon.classList.add("map--marker")
        markerIcon.src = MarkerIcon

        new mapboxGl.Marker({
            element: markerIcon
        })
            .setLngLat([lng, lat])
            .addTo(map.current)
    }, [lat, lng])

    useEffect(() => {
        getData()
        // eslint-disable-next-line
    }, [])

    return (
        <main className="flex flex-col items-center font-rubik px-6">
            <form onSubmit={handleSubmit} className="flex w-full max-w-[560px] h-14 rounded-2xl shadow-md">
                <input className="bg-white text-lg text-very-dark-gray rounded-l-2xl px-6 w-full focus:outline-none" type="text" onChange={handleChange} value={ipAddressInput} placeholder="Search for any IP address or domain" />
                <button className="bg-black w-14 shrink-0 rounded-r-2xl flex justify-center items-center" type="submit"><img className="pointer-events-none" src={ArrowIcon} alt="" /></button>
            </form>
            <section className="flex flex-col md:flex-row items-center md:items-stretch gap-6 bg-white w-full max-w-[1100px] rounded-2xl mt-6 py-6 md:p-8 shadow-md md:absolute md:top-[280px] md:mt-0 md:-translate-y-1/2">
                <div className="flex flex-col items-center md:items-start md:justify-center md:w-full gap-y-1 md:gap-y-4 md:border-r md:border-dark-gray md:border-opacity-30">
                    <h2 className="text-[10px] md:text-xs tracking-widest font-bold text-dark-gray">IP ADDRESS</h2>
                    <h3 className="text-xl md:text-[26px] font-medium text-very-dark-gray">{ipAddress}</h3>
                </div>
                <div className="flex flex-col items-center md:items-start md:justify-center md:w-full gap-y-1 md:gap-y-4 md:border-r md:border-dark-gray md:border-opacity-30">
                    <h2 className="text-[10px] md:text-xs tracking-widest font-bold text-dark-gray">LOCATION</h2>
                    <h3 className="text-xl md:text-[26px] font-medium text-very-dark-gray">{location}</h3>
                </div>
                <div className="flex flex-col items-center md:items-start md:justify-center md:w-full gap-y-1 md:gap-y-4 md:border-r md:border-dark-gray md:border-opacity-30">
                    <h2 className="text-[10px] md:text-xs tracking-widest font-bold text-dark-gray">TIMEZONE</h2>
                    <h3 className="text-xl md:text-[26px] font-medium text-very-dark-gray">{timezone}</h3>
                </div>
                <div className="flex flex-col items-center md:items-start md:justify-center md:w-full gap-y-1 md:gap-y-4">
                    <h2 className="text-[10px] md:text-xs tracking-widest font-bold text-dark-gray">ISP</h2>
                    <h3 className="text-xl md:text-[26px] font-medium text-very-dark-gray">{isp}</h3>
                </div>
            </section>
            <div className="app--backdrop absolute top-0 left-0 -z-10 shadow-lg" />
            <section className="absolute top-[300px] md:top-[280px] left-0 w-full -z-20">
                <div className="main--map" ref={mapContainer}></div>
            </section>
        </main>
    )
}