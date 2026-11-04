import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PopularVenueReport, ActiveApplicantReport } from "@/types/applications";


/* Reference: Arif, H. (2025, January 10). Generating PDFs in React with react-pdf - LogRocket Blog. LogRocket Blog. 
https://blog.logrocket.com/generating-pdfs-react/
‌*/
type ReportPDFProps = {
    popularVenues: PopularVenueReport[];
    activeApplicants: ActiveApplicantReport[];
};

const styles = StyleSheet.create({
    page: { padding: 24, fontSize: 10 },
    title: { fontSize: 16, marginBottom: 8 },
    sectionTitle: { fontSize: 12, marginTop: 12, marginBottom: 6 },
    row: { flexDirection: "row", borderBottom: "1 solid #ddd", paddingVertical: 4 },
    col1: { width: "10%" },
    col2: { width: "30%" },
    col: { width: "20%" },
    header: { fontWeight: 700 }
});

export function ReportPDF({ popularVenues, activeApplicants }: ReportPDFProps) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>Admin Dashboard Reports</Text>
                <Text>Generated: {new Date().toLocaleString()}</Text>

                <Text style={styles.sectionTitle}>Top Popular Venues</Text>
                <View style={[styles.row, styles.header]}>
                    <Text style={styles.col1}>#</Text>
                    <Text style={styles.col2}>Venue</Text>
                    <Text style={styles.col}>Location</Text>
                    <Text style={styles.col}>Bookings</Text>
                    <Text style={styles.col}>Popular Day</Text>
                </View>
                {popularVenues.map((r) => (
                    <View key={r.rank} style={styles.row}>
                        <Text style={styles.col1}>#{r.rank}</Text>
                        <Text style={styles.col2}>{r.venue.venueName}</Text>
                        <Text style={styles.col}>{r.venue.location}</Text>
                        <Text style={styles.col}>{String(r.totalBookings)}</Text>
                        <Text style={styles.col}>{r.mostPopularDay}</Text>
                    </View>
                ))}

                <Text style={styles.sectionTitle}>Top Active Applicants</Text>
                <View style={[styles.row, styles.header]}>
                    <Text style={styles.col1}>#</Text>
                    <Text style={styles.col2}>Name</Text>
                    <Text style={styles.col}>Email</Text>
                    <Text style={styles.col}>Successful</Text>
                    <Text style={styles.col}>Applications</Text>
                </View>
                {activeApplicants.map((r) => (
                    <View key={r.rank} style={styles.row}>
                        <Text style={styles.col1}>#{r.rank}</Text>
                        <Text style={styles.col2}>{r.hirer.firstName} {r.hirer.lastName}</Text>
                        <Text style={styles.col}>{r.hirer.email}</Text>
                        <Text style={styles.col}>{String(r.successfulBookings)}</Text>
                        <Text style={styles.col}>{String(r.totalApplications)}</Text>
                    </View>
                ))}
            </Page>
        </Document>
    );
}