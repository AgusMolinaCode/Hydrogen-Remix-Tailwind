const LOGOS = [
  <img
    key="logo1"
    src="/turn3.png"
    alt="logo1"
    width={500}
    height={500}
    className="h-22"
  />,
  <img
    key="logo2"
    src="/tucker.png"
    alt="logo2"
    width={400}
    height={400}
    className="h-22"
  />,
  <img
    key="logo3"
    src="/wps1.png"
    alt="logo3"
    width={400}
    height={400}
    className="h-[4.5rem]"
  />,
  <img
    key="logo3"
    src="/rekluse.png"
    alt="logo3"
    width={400}
    height={400}
    className="h-[4.5rem]"
  />,

  <img
    key="logo3"
    src="/ohlins.png"
    alt="logo3"
    width={400}
    height={400}
    className="h-[5rem]"
  />,
];

export default function SliderInfinite() {
  return (
    <div className="mt-20 sm:mt-32 relative m-auto h-full max-w-[900px] bg-transparent overflow-hidden before:absolute before:left-0 before:top-0 before:z-[2] before:h-20 px-2  before:content-[''] after:absolute after:right-0 after:top-0 after:z-[2] after:h-20  after:-scale-x-100  before:md:w-[60px] before:w-[60px] after:md:w-[60px] after:w-[60px] after:content-['']">
      <div className="animate-infinite-slider flex gap-14 w-[calc(200px*10)]">
        {LOGOS.map((logo) => (
          <div
            className="slide flex w-full items-center justify-center"
            key={logo.key}
          >
            {logo}
          </div>
        ))}
      </div>
    </div>
  );
}
