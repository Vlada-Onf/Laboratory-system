using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveWishlistComponentId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_wishlists_components_id",
                table: "wishlists");

            migrationBuilder.DropIndex(
                name: "ix_wishlists_component_id",
                table: "wishlists");

            migrationBuilder.DropColumn(
                name: "component_id",
                table: "wishlists");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "component_id",
                table: "wishlists",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "ix_wishlists_component_id",
                table: "wishlists",
                column: "component_id");

            migrationBuilder.AddForeignKey(
                name: "fk_wishlists_components_id",
                table: "wishlists",
                column: "component_id",
                principalTable: "components",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
