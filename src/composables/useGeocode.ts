import type { NominatimPlace } from "@/interfaces/Suntimes"
import axios from "axios"

const assembleGeocodeURLFromAddress = (address: string) => {

    return encodeURI(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`)
}

const geocode = async (address: string): Promise<NominatimPlace> => {
    try {
        const res = await axios.get<NominatimPlace[]>(assembleGeocodeURLFromAddress(address))

        if (!res.data.length)
            throw new Error("Not found")

        const place = res.data[0]
        if(!place) {
            throw new Error("Empty placelist")
        }

        return place

    } catch (err) {
        console.error("geocode failed :(")
        throw new Error("Error")
    }
}

export default function useGeocode () {
    return {
        geocode
    }
}