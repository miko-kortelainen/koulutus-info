const description = "Pyydettyä sivua ei löytynyt.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <meta content="noindex, follow" name="robots" />
    </>
  );
}
