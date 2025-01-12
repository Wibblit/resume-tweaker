

// import { Button } from '@/components/ui/button';
// import { ChevronLeft } from 'lucide-react';
// import Link from 'next/link';
// import Image from 'next/image';
// import Logo from "../../public/rt-dark.svg"

// export function CheckoutHeader() {
//   return (
//     <div className={'flex gap-4'}>
//       <Link href={'/'}>
//         <Button variant={'secondary'} className={'h-[32px] bg-[#182222] border-border w-[32px] p-0 rounded-[4px]'}>
//           <ChevronLeft />
//         </Button>
//       </Link>
//       <Image src={Logo} alt={'Resume Tweaker'} width={20} height={28} />
//     </div>
//   );
// }


import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/rt-dark.svg";

export function CheckoutHeader() {
  return (
    <div className="flex gap-4">
      <Link href="/">
        <Button
          variant="secondary"
          className="h-[32px] bg-secondary text-secondary-foreground border-border w-[32px] p-0 rounded-[4px]"
        >
          <ChevronLeft />
        </Button>
      </Link>
      <Image src={Logo} alt="Resume Tweaker" width={20} height={28} />
    </div>
  );
}

