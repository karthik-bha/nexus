

import { useState, useEffect } from "react";
import useDebounce from "../hooks/useDebounce";
import { Link } from "react-router-dom";


export default function SearchUser() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 350);

    // Fetch users
    const fetchUsers = async (q, p = 0) => {
        if (!q.trim()) {
            setResults([]);
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/public/search?query=${encodeURIComponent(q)}&page=${p}&size=10`
            );

            const data = await res.json();

            setResults(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.log("search error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Trigger search whenever debounced query changes
    useEffect(() => {
        fetchUsers(debouncedQuery, 0);
        setPage(0);
    }, [debouncedQuery]);

    // Handle pagination
    const nextPage = () => {
        if (page + 1 < totalPages) {
            const newPage = page + 1;
            setPage(newPage);
            fetchUsers(debouncedQuery, newPage);
        }
    };

    const prevPage = () => {
        if (page > 0) {
            const newPage = page - 1;
            setPage(newPage);
            fetchUsers(debouncedQuery, newPage);
        }
    };

    return (
        <div className="p-4 w-full max-w-md mx-auto">

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="
          w-full p-3 rounded-lg
          bg-neutral-900 text-white
          placeholder-neutral-500
          border border-neutral-800
          focus:outline-none focus:ring-2 focus:ring-neutral-700
        "
            />
            {/* Spinner */}
            {loading && (
                <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-neutral-700 border-t-white rounded-full animate-spin"></div>
                </div>
            )}
            {/* Result List */}
            <div className="mt-4 space-y-2">
                {results.length === 0 && debouncedQuery.length > 0 && (
                    <p className="text-neutral-500 text-sm">No users found.</p>
                )}

                {results.map((u) => (
                    <Link
                        to={`/public-profile/${u.username}`}
                        key={u.id}
                        className="
                            flex items-center gap-3 
                            p-3 rounded-lg
                            bg-neutral-900 
                            hover:bg-neutral-800 transition
                            cursor-pointer
                        "
                    >
                        <div
                            key={u.id}
                            className="
                        flex items-center gap-3 
                        p-3 rounded-lg
                        bg-neutral-900 w-full
                        hover:bg-neutral-800 transition
                        cursor-pointer
                        "
                        >

                            <img
                                src={u.profile_picture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                                className="w-10 h-10 rounded-full object-cover bg-neutral-700"
                            />
                            <span className="text-white">{u.username}</span>


                        </div>
                    </Link>
                ))}
            </div>

            {/* Pagination */}
            {results.length > 0 && (
                <div className="flex justify-between items-center mt-5">
                    <button
                        onClick={prevPage}
                        disabled={page === 0}
                        className="
              px-3 py-1 rounded-md
              bg-neutral-800 text-white
              disabled:opacity-40
            "
                    >
                        Prev
                    </button>

                    <span className="text-neutral-400 text-sm">
                        Page {page + 1} / {totalPages}
                    </span>

                    <button
                        onClick={nextPage}
                        disabled={page + 1 >= totalPages}
                        className="
              px-3 py-1 rounded-md
              bg-neutral-800 text-white
              disabled:opacity-40
            "
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
