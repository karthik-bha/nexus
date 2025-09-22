
const Navbar = () => {
    return (
        <div>
            <div className="max-w-[1200px] mx-auto border-2 rounded-b-3xl p-6 flex justify-between items-center">
                <h1  className="text-2xl md:text-3xl font-bold tracking-widest mb-2">NEXUS</h1>
                <div className="flex gap-6 items-center">
                  
                     <img
                        src="/src/assets/chat.svg"
                        className="w-8 h-8 hover:cursor-pointer hover:scale-110 transition-all 2s"
                    />
                      <img
                        src="/src/assets/account.svg"
                        className="w-9 h-9 hover:cursor-pointer hover:scale-110 transition-all 2s"
                    />
                </div>

            </div>

        </div>
    )
}

export default Navbar