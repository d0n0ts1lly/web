export default function Header({ search, setSearch }) {
  return (
    <>
      <h1 className="mb-3">Marathon Registry</h1>
      <input
        className="form-control mb-4"
        placeholder="Пошук..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </>
  );
}
