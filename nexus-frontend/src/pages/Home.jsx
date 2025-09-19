
const Home = () => {
    return (
        <div className="h-[100vh] items-center justify-center flex">
            <div className="text-center">
                <h1 className="text-[2.5rem] md:text-[2rem] font-bold tracking-widest">NEXUS</h1>
                <h2>The Nexus for all the happening</h2>
                <div className="flex justify-around mt-4">
                    <button className="border px-2 py-1 rounded-2xl"
                    onClick={()=> window.location.href = "/signup"}
                    >
                        Sign Up
                    </button>
                    <button className="border px-2 py-1 rounded-2xl">
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Home