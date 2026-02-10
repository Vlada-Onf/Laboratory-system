using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Converters
{
    public class DateTimeUtcConverter() : ValueConverter<DateTime, DateTime>(
        x => x.ToUniversalTime(),
        x => x.Kind == DateTimeKind.Unspecified
            ? DateTime.SpecifyKind(x, DateTimeKind.Utc)
            : x.ToUniversalTime());
}
