export default function Stats() {
  const stats = [
    { label: 'Happy Travelers', value: '10k+' },
    { label: 'Tours Completed', value: '500+' },
    { label: 'Destinations', value: '50+' },
    { label: 'Years Experience', value: '10+' },
  ];

  return (
    <section className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-4">
              <div className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-blue-100 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
