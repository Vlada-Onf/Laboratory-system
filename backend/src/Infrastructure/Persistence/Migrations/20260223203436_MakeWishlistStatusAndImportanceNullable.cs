using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class MakeWishlistStatusAndImportanceNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_wishlists_importances_id",
                table: "wishlists");

            migrationBuilder.DropForeignKey(
                name: "fk_wishlists_statuses_id",
                table: "wishlists");

            migrationBuilder.AlterColumn<Guid>(
                name: "status_id",
                table: "wishlists",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<Guid>(
                name: "importance_id",
                table: "wishlists",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "fk_wishlists_importances_id",
                table: "wishlists",
                column: "importance_id",
                principalTable: "wishlist_importances",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "fk_wishlists_statuses_id",
                table: "wishlists",
                column: "status_id",
                principalTable: "wishlist_statuses",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_wishlists_importances_id",
                table: "wishlists");

            migrationBuilder.DropForeignKey(
                name: "fk_wishlists_statuses_id",
                table: "wishlists");

            migrationBuilder.AlterColumn<Guid>(
                name: "status_id",
                table: "wishlists",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "importance_id",
                table: "wishlists",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "fk_wishlists_importances_id",
                table: "wishlists",
                column: "importance_id",
                principalTable: "wishlist_importances",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_wishlists_statuses_id",
                table: "wishlists",
                column: "status_id",
                principalTable: "wishlist_statuses",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
