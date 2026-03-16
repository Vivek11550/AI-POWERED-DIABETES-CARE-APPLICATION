import { View, Text, FlatList } from "react-native";
import { useEffect, useState } from "react";
import API from "../../src/services/api";

export default function patientList() {
    const [patients, setPatients] = useState([]);
    const [count, setCount] = useState(0);

    const fetchPatients = async () => {
        try {
            const res = await API.get("/admin/patients");

            setPatients(res.data.patients);
            setCount(res.data.count);
        } catch (error: any) {
            const message =
                error?.response?.data?.message || "Failed to fetch patients";
            alert(message);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Total Patients: {count}
            </Text>

            <FlatList
                data={patients}
                keyExtractor={(item: any) => item._id}
                renderItem={({ item }: any) => (
                    <View style={{ marginTop: 15 }}>
                        <Text>Name: {item.fullName}</Text>
                        <Text>Age: {item.age}</Text>
                        <Text>Gender: {item.gender}</Text>
                        <Text>Height: {item.heightCm} cm</Text>
                        <Text>Weight: {item.baselineWeightKg} kg</Text>
                        <Text>Diabetes Type: {item.diabetesType}</Text>
                        <Text>Phone: {item.phone}</Text>
                        <Text>Email: {item.userId?.email}</Text>
                    </View>
                )}
            />
        </View>
    );
}