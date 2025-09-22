
const Home = () => {
    return (
        <div className="h-[100vh] items-center justify-center flex">

            <div className="text-center z-50">
                <h1 className="text-3xl md:text-5xl font-bold tracking-widest mb-2">NEXUS</h1>
                <h2>The Nexus for all the happening</h2>
                <div className="flex justify-around mt-4">
                    <button className="button_style_1 text-[0.9rem] px-3"
                        onClick={() => window.location.href = "/auth?type=sign-up"}
                    >
                        Sign Up
                    </button>
                    <button className="button_style_1 text-[0.9rem] px-3"
                        onClick={() => window.location.href = "/auth?type=signin"}
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Home