"use client"

export default function AuthPage({ isSignin }: { isSignin: boolean }) {
    return <>
        <div className="flex flex-col items-center justify-center w-screen h-screen">
            <div className="p-2 m-2 bg-white rounded">
                <input type="text" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button onClick={() => {

                }
                }>{isSignin ? "Sign In" : "Sign Up"}</button>
            </div>
        </div>
    </>
}
