// import { getServerAuthSession } from "~/server/auth";

// export default async function Home() {
//   const hello = await api.post.hello({ text: "from tRPC" });
//   const session = await getServerAuthSession();

//   void api.post.getLatest.prefetch();

//   return (
//     <HydrateClient>
//       <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
//         <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
//           <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
//             Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
//           </h1>
//           <div className="flex flex-col items-center gap-2">
//             <div className="flex flex-col items-center justify-center gap-4">
//             </div>
//           </div>

//           {session?.user && <LatestPost />}
//         </div>
//       </main>
//     </HydrateClient>
//   );
// }

// "use client";

// import { useState } from "react";

// import { api } from "~/trpc/react";

// export function LatestPost() {
//   const [latestPost] = api.post.getLatest.useSuspenseQuery();

//   const utils = api.useUtils();
//   const createPost = api.post.create.useMutation({
//     onSuccess: async () => {
//       await utils.post.invalidate();
//     },
//   });

//   return (
//     <div className="w-full max-w-xs">
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           createPost.mutate({ name });
//         }}
//         className="flex flex-col gap-2"
//       >
//       </form>
//     </div>
//   );
// }

import React from 'react'
import TodaysRaceCards from '~/components/elements/todaysRaceCards';
import UpcomingRaceCards from '~/components/elements/upcomingRaceCards';

export default async function HomePage() {
    return (
        <div>
            <h2>Dnešní závody</h2>
            <TodaysRaceCards />
            <h2>Nadcházející závody</h2>
            <UpcomingRaceCards />
        </div>
    );
}


/*
TODO:
- !!! USE REACT QUERY !!!

- Edit racer info
- Datum in czech
- Show unsaved progress
- Tables control
- Dynamic update
- Prisma error handling
- Page stylying
- Race search
- Tooltips and anomalies (problems with data)
- Better homepage
- Geolocation based recommendation

- User roles
    - Admin - Event types, coeficients and parameters
    - Race manager - Whole race management
    - Event manager - Fills out measurements
    - Racer - Signs to races with account

    DB:
    - OAuth user - role, optional personal data
    - Personal data - name, surname, birthdate, sex, club
    - Racer - personal data

- Group of events - Tree like structure
*/

/*
BUGS:
- Cannot delete empty coeficients
*/

/*
COMMENTS:
- Penvé koeficienty a parametry skryté ovládané adminem
- Výběr závodu na začátku formuláře
- Uzamknout startovací pořadí (race manager)
- Startovací číslo = startovní číslo
- Nezaokhroulovat body ale usekávat
- Přihlasit se u specifického závodu
*/