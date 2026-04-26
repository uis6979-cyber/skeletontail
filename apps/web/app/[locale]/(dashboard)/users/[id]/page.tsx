"use client";

import { userService } from "@/services/user.service";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditUserPage() {
    const { id, locale } = useParams();
    const router = useRouter();

    const [form, setForm] = useState({
        email: "",
        firstName: "",
        lastName: "",
    });

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const data = await userService.getById(id as string);
        setForm(data);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        await userService.update(id as string, form);

        router.push(`/${locale}/users`);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />

            <button className="bg-blue-600 text-white px-4 py-2">Update</button>
        </form>
    );
}