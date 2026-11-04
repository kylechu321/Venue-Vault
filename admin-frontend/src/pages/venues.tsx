import { useEffect, useState } from "react";
import { LayOut } from "@/components/layouts/layOut";
import Link from "next/link";
import { UseAdminAuthGuard } from "@/components/webAuthGuard";
import { venueManagementServices } from "@/service/managementAPI";
import { Venue, CreateVenueArgs } from "@/types/venues";

export default function ManageVenues() {
    UseAdminAuthGuard();
    const [venues, setVenues] = useState<Venue[]>([]);
    const [vendors, setVendors] = useState<{ id: number; userID: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
    const [form, setForm] = useState<CreateVenueArgs>({
        vendorId: 0,
        venueName: "",
        description: "",
        location: "",
        capacity: 0,
        suitability: "",
        featured: 0,
    });

    const loadData = async () => {
        try {
            const [v, vd] = await Promise.all([
                venueManagementServices.getVenues(),
                venueManagementServices.getVendors(),
            ]);
            setVenues(v);
            setVendors(vd);
        } catch {
            setError("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleEdit = (venue: Venue) => {
        setEditingVenue(venue);
        setForm({
            vendorId: venue.vendorId,
            venueName: venue.venueName,
            description: venue.description,
            location: venue.location,
            capacity: venue.capacity,
            suitability: venue.suitability,
            featured: venue.featured,
        });
        setShowForm(true);
    };

    const isFormValid =
        form.venueName.trim() !== "" &&
        form.location.trim() !== "" &&
        form.capacity > 0 &&
        form.suitability.trim() !== "" &&
        form.description.trim() !== "" &&
        form.vendorId > 0;

    const handleSubmit = async () => {
        if (!isFormValid) {
            setError("Please fill in all required fields");
            return;
        }

        try {
            if (editingVenue) {
                await venueManagementServices.updateVenue({ id: editingVenue.id, ...form });
            } else {
                await venueManagementServices.createVenue(form);
            }
            setShowForm(false);
            setEditingVenue(null);
            setForm({ vendorId: 0, venueName: "", description: "", location: "", capacity: 0, suitability: "", featured: 0 });
            await loadData();
        } catch {
            setError("Failed to save venue");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this venue?")) return;
        try {
            await venueManagementServices.deleteVenue(id);
            await loadData();
        } catch {
            setError("Failed to delete venue");
        }
    };

    const handleToggleFeatured = async (id: number) => {
        try {
            await venueManagementServices.toggleFeatured(id);
            await loadData();
        } catch {
            setError("Failed to toggle featured");
        }
    };

    const handleAssignVendor = async (venueId: number, vendorId: number) => {
        try {
            await venueManagementServices.assignVendorToVenue(venueId, vendorId);
            await loadData();
        } catch {
            setError("Failed to assign vendor");
        }
    };

    return (
        <LayOut>
            <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
                <h1 className="text-3xl font-light tracking-tight text-gray-900">Manage Venues</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => { setShowForm(true); setEditingVenue(null); }}
                        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white text-sm"
                    >
                        Add Venue
                    </button>
                    <Link href="/dashboard" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-gray-800 text-sm">
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Form */}
            {showForm && (
                <div className="border border-gray-300 rounded-xl p-6 mb-8 bg-white">
                    <h2 className="text-lg font-semibold mb-4 text-black">{editingVenue ? "Edit Venue" : "Create Venue"}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Venue Name</label>
                            <input required value={form.venueName} onChange={(e) => setForm({ ...form, venueName: e.target.value })}
                                className="w-full border border-gray-700 rounded px-3 py-2 text-sm text-black" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Location</label>
                            <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                                className="w-full border border-gray-700 rounded px-3 py-2 text-sm text-black" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Capacity</label>
                            <input required min={1} type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                                className="w-full border border-gray-700 rounded px-3 py-2 text-sm text-black" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Suitability</label>
                            <input required value={form.suitability} onChange={(e) => setForm({ ...form, suitability: e.target.value })}
                                className="w-full border border-gray-700 rounded px-3 py-2 text-sm text-black" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm text-gray-700 mb-1">Description</label>
                            <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full border border-gray-700 rounded px-3 py-2 text-sm text-black" rows={3} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Vendor</label>
                            <select required value={form.vendorId} onChange={(e) => setForm({ ...form, vendorId: Number(e.target.value) })}
                                className="w-full border border-gray-700 rounded px-3 py-2 text-sm text-black">
                                <option value={0}>Select vendor</option>
                                {vendors.map((v) => (
                                    <option key={v.id} value={v.id}>Vendor #{v.id} (User {v.userID})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Featured</label>
                            <select required value={form.featured} onChange={(e) => setForm({ ...form, featured: Number(e.target.value) })}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black">
                                <option value={0}>No</option>
                                <option value={1}>Yes</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid}
                            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white text-sm"
                        >
                            {editingVenue ? "Update" : "Create"}
                        </button>
                        <button onClick={() => { setShowForm(false); setEditingVenue(null); }}
                            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-gray-800 text-sm">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            {loading ? <p className="text-gray-500">Loading...</p> : (
                <div className="rounded-xl border border-gray-300 overflow-hidden bg-white">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Location</th>
                                <th className="px-4 py-3">Capacity</th>
                                <th className="px-4 py-3">Suitability</th>
                                <th className="px-4 py-3">Vendor</th>
                                <th className="px-4 py-3">Featured</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {venues.map((venue) => (
                                <tr key={venue.id} className="border-t border-gray-200">
                                    <td className="px-4 py-3 text-gray-500">{venue.id}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{venue.venueName}</td>
                                    <td className="px-4 py-3 text-gray-700">{venue.location}</td>
                                    <td className="px-4 py-3 text-gray-700">{venue.capacity}</td>
                                    <td className="px-4 py-3 text-gray-700">{venue.suitability}</td>
                                    <td className="px-4 py-3 text-gray-700">
                                        <select
                                            value={venue.vendorId}
                                            onChange={(e) => handleAssignVendor(venue.id, Number(e.target.value))}
                                            className="border border-gray-300 rounded px-2 py-1 text-xs"
                                        >
                                            <option value={0}>Unassigned</option>
                                            {vendors.map((v) => (
                                                <option key={v.id} value={v.id}>Vendor #{v.id}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleToggleFeatured(venue.id)}
                                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${venue.featured === 1 ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-700"}`}
                                        >
                                            {venue.featured === 1 ? "Featured" : "Not Featured"}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <button onClick={() => handleEdit(venue)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(venue.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </LayOut>
    );
}