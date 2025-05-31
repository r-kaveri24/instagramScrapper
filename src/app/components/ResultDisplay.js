export default function ResultDisplay({ result, username }) {
    if (!result) return null;

    if (result.error) {
        return (
            <div className="w-full h-full mt-6 p-6 overflow-auto rounded-xl text-red-600 text-center">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p>{result.error}</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full mt-6 p-6 overflow-auto rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">
                Scraped Instagram Data
            </h2>
            <div className="flex w-full h-fit ">
                <div className="w-[150px] h-[150px] bg-white rounded-full overflow-hidden mr-[50px]">
                    <img src="/profile.png" className="w-[250px] h-full rounded-full" alt="Profile" />
                </div>
                <div>
                    <div className="space-y-7">
                        <div className="flex gap-4">
                            <p className="text-xl font-medium">{username || "Unknown User"}</p>
                            <div className="flex gap-2">
                                <button className="w-[100px] h-[32px] text-white bg-[#363636] px-4 text-[14px] rounded-xl">Edit profile</button>
                                <button className="w-[115px] h-[32px] text-white bg-[#363636] px-4 text-[14px] rounded-xl">View archive</button>
                            </div>
                        </div>
                        {result && typeof result === 'object' && !Array.isArray(result) ? (
                            <div className="flex gap-6 text-black">

                                <h3 className="text-lg font-bold">{result.followers}</h3>
                                <p className="text-[18px] font-light">Followers</p>


                                <h3 className="text-lg font-bold">{result.following}</h3>
                                <p className="text-[18px] font-light">Following</p>


                                <h3 className="text-lg font-bold">{result.posts}</h3>
                                <p className="text-[18px] font-light">Posts</p>

                            </div>
                        ) : (
                            <p>No data available.</p>
                        )}
                    </div>
                    <div className="mt-5">
                        <p>Name</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
