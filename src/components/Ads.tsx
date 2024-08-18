import Image from 'next/image'


type Props = {}

export default function Ads({ size }: { size: "sm" | "md" | "lg" }) {
    return (
        <div className='p-4 bg-slate-800 text-gray-400 rounded-lg shadow-md text-sm'>
            {/* top */}
            <div className='flex items-center justify-between text-gray-500 font-medium'>
                <span>Sponsored Ads</span>
                <Image src="/more.png" alt='' width={16} height={16} />

            </div>
            {/* bottom */}
            <div className={`flex flex-col mt-4 ${size === "sm" ? "gap-2" : "gap-4"}`}>
                <div className={`relative w-full ${size === "sm" ? "h-24" : size === "md" ? "h-36" : "h-48"}`}>
                    <Image sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw" src='https://images.pexels.com/photos/15656549/pexels-photo-15656549/free-photo-of-woman-putting-a-meat-dish-on-a-table.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' alt='' fill className='rounded-lg object-cover' />
                </div>
                <div className='flex items-center gap-4'>
                    <Image src='https://images.pexels.com/photos/15656549/pexels-photo-15656549/free-photo-of-woman-putting-a-meat-dish-on-a-table.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' alt='' width={24} height={24} className='rounded-full w-6 h-6 object-cover' />
                    <span className='text-red-600 font-medium'>BigChef Launch</span>
                </div>
                <p className={size === "sm" ? "text-sm" : "text-sm"}>
                    {size === "sm"
                        ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                        : size === "md"
                            ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, eleifend nunc. Sed nec molestie nunc. Nulla facilisi. Nullam nec nisi ut nisi ultricies posuere. Nullam nec nisi ut nisi ultricies posuere."
                            : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, eleifend nunc. Sed nec molestie nunc. Nulla facilisi. Nullam nec nisi ut nisi ultricies posuere. Nullam nec nisi ut nisi ultricies posuere. lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, eleifend nunc. Sed nec molestie nunc. Nulla facilisi. Nullam nec nisi ut nisi ultricies posuere. Nullam nec nisi ut nisi ultricies posuere."
                    }

                </p>
                <button className='bg-slate-700 text-gray-100 p-2 text-xs rounded-lg'>Learn more</button>
            </div>
        </div>
    )
}