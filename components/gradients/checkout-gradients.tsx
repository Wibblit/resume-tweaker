export function CheckoutGradients() {
  return (
    <>
      <div className={'hidden md:block'}>
        <div className={'top-left-gradient-background w-full absolute -z-10 min-h-[1280px]'}></div>
        <div className={'bottom-right-gradient-background w-full absolute -z-10 min-h-[1280px]'}></div>
        <div className={'grain-background w-full absolute -z-10 min-h-[1280px]'}></div>
        <div className={'grid-bg w-full absolute -z-10 min-h-[1280px]'}></div>
      </div>
      <div className={'block md:hidden'}>
        <div className={'checkout-mobile-grainy-blur checkout-mobile-top-gradient w-full absolute -z-10'}></div>
        <div className={'checkout-mobile-grainy-blur checkout-mobile-bottom-gradient w-full absolute -z-10'}></div>
        <div className={'grain-background w-full absolute -z-10 h-full min-h-screen'}></div>
      </div>
    </>
  );
}
