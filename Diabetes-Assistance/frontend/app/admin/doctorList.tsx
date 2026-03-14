import { View, Text, FlatList } from "react-native";
import { useEffect, useState } from "react";
import API from "../../src/services/api";

export default function doctorList() {
    const [doctors, setDoctors] = useState([]);
    const [count, setCount] = useState(0);


    const fetchDoctors = async () => {
        try {
            const res = await API.get("/admin/doctors");

            setDoctors(res.data.doctors);
            setCount(res.data.count);
        } catch (error: any) {
            const message =
                error?.response?.data?.message || "Failed to fetch doctors";
            alert(message);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Total Doctors: {count}
            </Text>

            <FlatList
                data={doctors}
                keyExtractor={(item: any) => item._id}
                renderItem={({ item }: any) => (
                    <View style={{ marginTop: 15 }}>
                        <Text>Name: {item.fullName}</Text>
                        <Text>Specialization: {item.specialization}</Text>
                        <Text>Qualification: {item.qualification}</Text>
                        <Text>Hospital: {item.hospitalName}</Text>
                        <Text>Experience: {item.experienceYears} years</Text>
                        <Text>Email: {item.userId?.email}</Text>
                    </View>
                )}
            />
        </View>
    );
}