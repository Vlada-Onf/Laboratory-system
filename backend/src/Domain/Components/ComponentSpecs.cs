using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Components
{
    public class ComponentSpecs
    {
        public int? Quantity { get; private set; }
        public decimal? Price { get; private set; }
        public decimal? TotalCost { get; private set; }

        private ComponentSpecs(
            int? quantity,
            decimal? price,
            decimal? totalCost)
        {
            Quantity = quantity;
            Price = price;
            TotalCost = totalCost;
        }
        public static ComponentSpecs Create(int quantity, decimal price)
        {
            if (quantity < 0)
            {
                throw new ArgumentException("Кількість не може бути негативним", nameof(quantity));
            }
            if (price < 0)
            {
                throw new ArgumentException("Ціна не може бути негативною", nameof(price));
            }
            decimal totalCost = quantity * price;
            return new ComponentSpecs(
                quantity,
                price,
                totalCost);
        }
        public void Update(int quantity, decimal price)
        {
            if (quantity < 0)
            {
                throw new ArgumentException("Кількість не може бути негативним", nameof(quantity));
            }
            if (price < 0)
            {
                throw new ArgumentException("Ціна не може бути негативною", nameof(price));
            }
            Quantity = quantity;
            Price = price;
            TotalCost = quantity * price;
        }
    }
}
