import Image from 'next/image';

export default function Home() {
  return (
    <main className="intro-page">

      <header className="site-header">
        <Image src="/header.png" alt="Skinstric Logo" className="logo" fill sizes="100vw" />
      </header>

      <div className="intro-content">
        <h1 className="intro-heading">
          Sophisticated <br />
          <span>skincare</span>
        </h1>

        <p className="intro-description desktop-only">
          Skinstric developed an A.I. that creates a highly-personalized
          routine tailored to what your skin needs.
        </p>

        <div className="intro-button-wrapper">
          <a href="/testing">
            <button className="intro-button">ENTER EXPERIENCE</button>
          </a>
        </div>
      </div>

      <div className="side-section left">
        <Image src="/Rectangle 2779.png" className="half-rhombus" alt="Left Rhombus" width={302} height={604} />
        <button className="side-button">
          <Image src="/discover.png" className="side-button-img" alt="Discover" width={150} height={44} />
        </button>
      </div>

      <div className="side-section right">
        <Image src="/Rectangle 2778.png" className="half-rhombus" alt="Right Rhombus" width={302} height={604} />
        <a href="/testing">
          <button className="side-button">
            <Image src="/take-test.png" className="side-button-img" alt="Take Test" width={127} height={44} />
          </button>
        </a>
      </div>


      <div className="rhombus-bg"></div>

    </main>
  );
}